<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import DetailsPage from '$lib/components/DetailsPage.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	export let data: PageData;

	let returnPath = '/finance';
	let selectedCategory = null;

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('return')) {
			returnPath = urlParams.get('return');
		}
		selectedCategory = data.finance.fk_finance_category_id;
	});

	const saveOperation = async (event) => {
		const formData = new FormData(event.target);
		formData.append('id', $page.url.searchParams.get('id'));
		const res = await fetch(`/api/finance`, {
			method: 'POST',
			body: formData
		}).then((res) => res.json());
		const { status, body } = res;
		if (status === 200 || status === 201) {
			toast.success('Zapisano!');
			goto(returnPath, { invalidateAll: true });
		} else if (status === 400) {
			toast.error('Błędne dane! - ' + body);
		} else {
			toast.error('Wystąpił błąd! - ' + body);
			console.log('Error:', status, body);
		}
	};

	const deleteOperation = async (event) => {
		if (!$page.url.searchParams.get('id')) {
			goto('/finance');
			return;
		}
		const res = await fetch(`/api/finance/` + $page.url.searchParams.get('id'), {
			method: 'DELETE'
		}).then((res) => res.json());
		const { status, body } = res;
		if (status === 204) {
			toast.success('Usunięto!');
			goto(returnPath, { invalidateAll: true });
		} else {
			toast.error('Wystąpił błąd! - ' + res);
			console.log('Error:', status, body);
		}
	};

	const addCategory = async (event) => {
		const formData = new FormData(event.target);
		const res = await fetch(`/api/finance/category`, {
			method: 'POST',
			body: formData
		}).then((res) => res.json());
		const { status, body } = res;
		if (status === 200 || status === 201) {
			toast.success('Dodano!');
			goto(returnPath, { invalidateAll: true });
		} else if (status === 400) {
			toast.error('Błędne dane! - ' + body);
		} else {
			toast.error('Wystąpił błąd! - ' + body);
			console.log('Error:', status, body);
		}
	};

	const openDialog = (category: number | null = null) => {
		selectedCategory = category;
		(document.getElementById('category_modal') as HTMLFormElement).showModal();
	};

	function closeDeleteDialog() {
		if (typeof window !== 'undefined') {
			(document.getElementById('delete_operation_modal') as HTMLFormElement).close();
			selectedCategory = null;
		}
	}

	function closeCategoryDialog() {
		if (typeof window !== 'undefined') {
			(document.getElementById('category_modal') as HTMLFormElement).close();
			selectedCategory = null;
		}
	}
</script>

<DetailsPage
	title="Edytuj wpis finansowy"
	descTitle="Szczegóły transakcji"
	desc="Wypełnij pola obowiązkowe"
	formId="finance-form"
	onSubmit={saveOperation}
	deleteAction={() => {
		document.getElementById('delete_operation_modal').showModal();
	}}
	cancelAction={() => goto(returnPath)}
>
	<div class="md:col-span-5">
		<label for="name">Nazwa</label>
		<input
			type="text"
			name="name"
			id="name"
			value={data.finance?.name || ''}
			placeholder="Chusty harcerskie"
			minlength="3"
			required
		/>
	</div>
	<div class="md:col-span-2">
		<label for="amount">Kwota</label>
		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">PLN</div>
			<input
				type="text"
				name="amount"
				id="amount"
				class="block pl-11"
				value={data.finance?.amount ? Math.abs(data.finance.amount).toFixed(2) : ''}
				placeholder="21,37"
			/>
		</div>
	</div>
	<div class="md:col-span-1">
		<label for="type">Rodzaj transakcji</label>
		<select name="type" id="type">
			<option value="expense" selected={data.finance.amount < 0}>Wydatek</option>
			<option value="income" selected={data.finance.amount > 0}>Przychód</option>
		</select>
	</div>
	<div class="md:col-span-2">
		<label for="category">Kategoria</label>
		<select name="category" id="category">
			<option value="" selected={selectedCategory === null}>Brak</option>
			{#each data.categories as category}
				<option value={category.id} selected={selectedCategory === category.id}>
					<span class="flex items-center justify-between">
						<span>{category.name}</span>
						<svg
							class="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</span>
				</option>
			{/each}
			<option on:click|preventDefault={() => openDialog()} value="">Dodaj nową kategorię</option>
		</select>
	</div>
	<div class="md:col-span-3">
		<label for="doc_number">Numer dokumentu</label>
		<input
			type="text"
			name="doc_number"
			id="doc_number"
			value={data.finance?.invoice_number || ''}
			placeholder="FV 123/2021"
		/>
	</div>
	<div class="md:col-span-2">
		<label for="date">Data</label>
		<input type="date" name="date" id="date" value={data.finance?.date || ''} required />
	</div>
</DetailsPage>

<Dialog dialogId="delete_operation_modal" title="Usuwanie transakcji">
	<p class="text-xl font-semibold text-gray-700 dark:text-gray-200">
		Czy na pewno chcesz usunąć transakcję <b>{data.finance?.name}</b>?
	</p>
	<p class="text-gray-600 text-lg font-semibold dark:text-gray-400">Tego nie można cofnąć.</p>
	<div class="flex justify-center mt-5">
		<button
			form="email-form"
			class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
			on:click={deleteOperation}
		>
			Tak, usuń
		</button>
		<form method="dialog" on:submit={closeDeleteDialog}>
			<button
				class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2 text-center"
			>
				Nie, anuluj
			</button>
		</form>
	</div>
</Dialog>

<Dialog
	dialogId="category_modal"
	title="Kategoria transakcji"
	closeDialogOverride={closeCategoryDialog()}
>
	<p class="text-xl mb-3 font-semibold text-gray-700 dark:text-gray-200">
		Dodaj nową kategorię transakcji
	</p>
	<form id="email-form" method="dialog" on:submit={addCategory}>
		<label for="email">Nazwa kategorii</label>
		<input type="text" name="category_name" id="category_name" placeholder="Materiały" required />
	</form>
	<div class="flex justify-center mt-5">
		<button
			form="email-form"
			class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
		>
			Tak, dodaj
		</button>
		<button
			class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2 text-center"
			on:click|preventDefault={closeCategoryDialog}
		>
			Nie, anuluj
		</button>
	</div>
</Dialog>
