<script lang="ts">
	import FinanceCard from './FinanceCard.svelte';

	import type { PageData } from './$types';

	import ColorTag from '../../../lib/components/ColorTag.svelte';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';
	import TableView from '$lib/components/TableView.svelte';
	export let data: PageData;

	let isMobile;
	let innerWidth;

	$: isMobile = innerWidth < 640;

	onMount(() => {
		renderChart();
	});

	function renderChart() {
		let ctx = document.getElementById('category_chart').getContext('2d');
		let chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: data.categories_chart.map((category) => {
					if (category.name != null) return category.name;
					if (category.percent < 0) return 'Inne wydatki';
					if (category.fee) return 'Składki';
					return 'Inne przychody';
				}),
				// and values
				datasets: [
					{
						label: 'Przychody',
						data: data.categories_chart.map((category) => {
							return category.percent > 0 ? category.percent : 0;
						}),
						backgroundColor: data.categories_chart.map((category) => {
							if (category.fee) return 'green';
							return category.color || 'grey';
						})
					},
					{
						label: 'Wydatki',
						data: data.categories_chart.map((category) => {
							return category.percent < 0 ? category.percent : 0;
						}),
						backgroundColor: data.categories_chart.map((category) => {
							return category.color || 'grey';
						})
					}
				]
			},
			options: {}
		});
	}
	const handleClick = (operation) => {
		if (operation.fk_fee != null)
			return toast.error('Nie można edytować składek z poziomu tego widoku!\nUżyj modułu składek.');
		if (!operation.id) return toast.error('Nie można edytować tej operacji - brak ID!');
		goto(`/finance/finance_details?id=${operation.id}`);
	};
</script>

<svelte:window bind:innerWidth />

<svelte:head>
	<title>Książka finansowa</title>
</svelte:head>

<main class="h-full pb-16 overflow-scroll md:overflow-hidden">
	<div class="container grid px-6 mx-auto">
		<div class="flex justify-between items-center">
			<div>
				<h2 class="mt-6 mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
					Książka finansowa
				</h2>
				<h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
					Podsumowanie stanu finansów w drużynie
				</h4>
			</div>
			<div>
				<button
					class="px-4 py-2 text-sm font-medium tracking-wide text-green-600 capitalize transition-colors duration-200 transform border border-green-600
					 rounded-md hover:bg-green-500 focus:outline-none focus:bg-green-500"
					on:click={() => goto('/report')}
				>
					Generuj raport
				</button>
				<button
					class="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:bg-green-500"
					on:click={() => goto('/finance/finance_details')}
				>
					Dodaj wpis
				</button>
			</div>
		</div>
		<div class="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
			<div class="flex flex-wrap gap-y-8 mb-4">
				<FinanceCard
					value="{data.team_money || 0} PLN"
					text={isMobile ? 'Budżet' : 'Aktualny budżet'}
					textColor="text-yellow-500"
					baseColor="bg-yellow-500"
				/>
				<FinanceCard
					value="{data.year_expenses} PLN"
					text={isMobile ? 'Wydatki w RH' : 'Wydatki w obecnym RH'}
					textColor="text-red-500"
					baseColor="bg-red-500"
				/>
				<FinanceCard
					value="{data.year_earnings} PLN"
					text={isMobile ? 'Dochody w RH' : 'Przychody w obecnym RH'}
					textColor="text-green-500"
					baseColor="bg-green-500"
				/>
				<FinanceCard
					value={isMobile ? 'Liczba ' + data.year_count : data.year_count + ' pozycje'}
					text={isMobile ? 'Liczba pozycji' : 'Liczba transakcji w RH'}
					textColor="text-blue-500"
					baseColor="bg-blue-500"
				/>
			</div>
			<div class="flex flex-wrap-reverse gap-y-5">
				<div class="md:w-2/3 w-full">
					<h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
						Ostatnie transakcje
					</h4>
					<TableView labelList={['Nazwa', 'Data', 'Kategoria', 'Kwota']}>
						{#each data.last_operations as operation}
							<tr
								class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
								on:click={() => handleClick(operation)}
							>
								<td>
									<div class="flex items-center text-sm">
										<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
											<div class="w-0 h-0 rounded-full shadow-inner scale-50">
												<svg class={operation.amount > 0 ? 'fill-green-600' : 'fill-red-600'}>
													<defs id="defs1328" />
													<path
														style="opacity:1;stroke:none;stroke-width:259.50698853;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
														d="M 31.1875 0 C 13.904525 0.43835438 3.7379722e-013 14.612004 0 32 C 2.3684758e-015 49.663996 14.336004 64 32 64 C 49.663996 64 64 49.663996 64 32 C 64 14.336004 49.663996 1.3812956e-013 32 0 C 31.724 3.7007434e-017 31.461833 -0.0069580061 31.1875 0 z M 31.15625 5.5 C 31.439783 5.4910103 31.714297 5.5 32 5.5 C 46.628003 5.4999998 58.5 17.371998 58.5 32 C 58.499998 46.628001 46.628002 58.5 32 58.5 C 17.371999 58.499999 5.5 46.628002 5.5 32 C 5.4999999 17.657701 16.922915 5.9512829 31.15625 5.5 z "
														id="path1334"
													/>
													<path
														style="font-size:53.81440353px;font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;text-align:start;line-height:100%;writing-mode:lr-tb;text-anchor:start;opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;font-family:Arial Narrow"
														d="M 25.645354,38.743144 C 27.706139,41.625309 33.995692,41.833441 36.155115,40.6114 C 36.947727,40.162852 37.145708,38.864507 37.145725,37.98432 C 37.145708,37.380283 36.986739,36.905677 36.668816,36.560499 C 36.333199,36.215341 35.479466,35.339232 34.490338,35.080346 C 29.473962,33.785975 25.998702,32.169274 24.638637,30.995688 C 22.942961,29.528736 22.669211,28.570622 22.669213,26.016357 C 22.669211,23.462132 23.403703,21.32133 25.064052,19.785304 C 26.724393,18.24933 29.135426,17.481331 32.297159,17.481304 C 35.317562,17.481331 39.565451,18.278588 41.636566,20.737131 L 38.183516,24.493331 C 36.236051,22.858359 34.787665,22.710631 32.403139,22.710609 C 30.901751,22.710631 30.120168,22.926362 29.484299,23.3578 C 28.848414,23.772024 28.530476,24.315664 28.530483,24.988721 C 28.530476,25.592786 28.821918,26.09328 29.404815,26.490205 C 29.987693,26.904426 31.511133,27.525729 34.549225,28.354116 C 37.958218,29.286087 40.272103,30.416513 41.490888,31.745396 C 42.691968,33.074309 43.292518,34.843296 43.292541,37.052364 C 43.292518,39.710168 42.356366,41.901988 40.484082,43.627827 C 38.629421,45.353671 36.346462,46.694998 33.061111,46.694997 C 28.832157,46.694996 23.187374,45.201054 21.630014,42.439699"
														id="text1367"
													/>
													<path
														style="opacity:1;stroke:none;stroke-width:259.50698853;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
														d="M 30.375,12.875 L 30.375,19.71875 L 33.625,19.71875 L 33.625,12.875 L 30.375,12.875 z M 30.375,44.96875 L 30.375,51.125 L 33.625,51.125 L 33.625,44.96875 L 30.375,44.96875 z "
														id="rect2278"
													/>
												</svg>
											</div>
										</div>
										<div>
											<p class="font-semibold">{operation.name}</p>
											<p class="text-xs text-gray-600 dark:text-gray-400">
												{operation.amount > 0 ? 'Przychód' : 'Wydatek'}
											</p>
										</div>
									</div>
								</td>
								<td>{operation.date}</td>
								<ColorTag
									color={operation.finance_categories?.color ||
										(operation.fk_fee == null ? 'grey' : 'green')}
									title={operation.finance_categories?.name ||
										(operation.fk_fee == null ? 'Brak kategorii' : 'Składka')}
								/>
								<td class="text-sm"
									>{operation.amount > 0 ? '+' : '-'} {Math.abs(operation.amount)} PLN</td
								>
							</tr>
						{/each}
					</TableView>
					<div class="w-full text-center pt-2">
						<a class="text-blue-500 hover:underline" href="/finance/list"
							>Zobacz wszystkie transakcje</a
						>
					</div>
				</div>
				<div class="w-2/7 mx-auto">
					<canvas id="category_chart" />
				</div>
			</div>
		</div>
	</div>
</main>
