<script lang="ts">
	import { closeSideMenu, togglePageMenu } from '../../helpers/menu';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/app_logo.jpg';

	const appName = 'Scout Manager';

	$: isMainLink = (link: any) => {
		if (!link.url) {
			return false;
		}
		return link.url === activeUrl.pathname;
	};

	$: changeLink = (link: any) => {
		closeSideMenu();
		goto(link.url);
	};

	$: activeUrl = $page.url;

	export let withTitle = true;
	export let links = [
		{
			name: 'Strona główna',
			url: '/dashboard',
			svg: [
				'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
			]
		},
		{
			name: 'Ewidencja',
			url: '/people',
			svg: [
				'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
			]
		},
		{
			name: 'Składki',
			url: '/fees',
			svg: [
				'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
			]
		},
		{
			name: 'Zastępy i grupy',
			url: '/groups',
			svg: [
				'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
			]
		},
		{
			name: 'Książka finansowa',
			url: '/finance',
			svg: ['M4 6h16M4 10h16M4 14h16M4 18h16']
		},
		{
			name: 'Użytkownicy',
			url: '/authorized',
			svg: [
				'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
			]
		}
	];
</script>

<div class="py-4 text-gray-500 dark:text-gray-400">
	{#if withTitle}
		<div class="flex items-center">
			<img src={logo} class="ml-6 w-11 h-11 rounded-full" alt="logo" />
			<a class="text-lg ml-3 font-bold text-base-content" href="/">{appName}</a>
		</div>
	{/if}
	<ul class="mt-6">
		{#each links as link}
			<li class="relative px-6 py-3">
				<a
					class="{isMainLink(link) &&
						'text-base-content'} inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-base-content"
					href={link.url}
					on:click={(e) => {
						e.preventDefault();
						changeLink(link);
					}}
				>
					{#if link.svg}
						<svg
							class="w-5 h-5"
							aria-hidden="true"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							{#each link.svg as s, b}
								<path d={s} />
							{/each}
						</svg>
					{/if}
					<span class="ml-4">{link.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>
