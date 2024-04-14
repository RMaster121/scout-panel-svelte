<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ColorTag from '$lib/components/ColorTag.svelte';
	import { capitalizeEveryWord } from '$lib/utils/text-utils';
	import { toast } from 'svelte-french-toast';
	import type { PageData } from './$types';
	import TableView from '$lib/components/TableView.svelte';
	import MainPage from '$lib/components/MainPage.svelte';
	import PersonAvatarText from '$lib/components/PersonAvatarText.svelte';
	import Dialog from '$lib/components/Dialog.svelte';

	let selectedPerson = null;

	export let data: PageData;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const addAccess = async (event) => {
		const form = new FormData(event.target);
		if (!selectedPerson || !selectedPerson?.id) {
			toast.error('Nie wybrano osoby!');
			return;
		}
		form.append('id', selectedPerson.id);
		const res = await fetch(`/api/auth/add_access`, {
			method: 'POST',
			body: form
		}).then((res) => res.json());
		const { status, body } = res;
		if (status === 200 || status === 201) {
			toast.success('Zapisano!');
			invalidateAll();
		} else if (status === 400) {
			toast.error('Błędne dane! - ' + body);
		} else {
			toast.error('Wystąpił błąd! - ' + body);
			console.log('Error:', status, body);
		}
	};
	const resetPassword = async () => {
		toast.loading('Wysyłanie emaila z linkiem do resetu hasła...');
		const { data, error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
			redirectTo: window.location.origin + '/invited'
		});
		toast.dismiss();
		if (error) {
			console.log('Error:', error);
			toast.error('Wystąpił błąd! - ' + error.message);
		} else {
			toast.success('Wysłano email z linkiem do resetu hasła!');
		}
	};

	function closeDialog() {
		if (typeof document === 'undefined') return;
		(document.getElementById('person_modal') as HTMLFormElement).close();
		selectedPerson = null;
	}
</script>

<MainPage title="Użytkownicy" subtitle="Lista osób z dostępem do jednostki">
	<TableView
		labelList={['Imię i Nazwisko', 'Funkcja', 'Zastęp główny', 'Stopień', 'Dostęp', 'Akcja']}
	>
		{#each data.people as person}
			<tr
				class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
				on:click={() => {
					document.getElementById('person_modal').showModal();
					selectedPerson = person;
				}}
			>
				<PersonAvatarText picturesPromise={data.streamed.picturesList} {person} />
				<ColorTag color={person.roles?.color} title={person.roles?.name} />
				<td class="text-sm">{person.small_groups?.name || 'Brak zastępu'}</td>
				<ColorTag
					classes="pr-10"
					color={person.degrees?.color}
					title={person.degrees?.name ?? 'HBS'}
				/>
				<ColorTag
					color={person.fk_user_id ? 'rgba(0, 128, 0, 0.75)' : 'grey'}
					title={person.fk_user_id ? 'Przyznano' : 'Nie przyznano'}
				/>
				<td>
					<button
						class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
						aria-label="Edit"
					>
						<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M9 4a2 2 0 114 0 2 2 0 01-4 0zM9 10a2 2 0 114 0 2 2 0 01-4 0zM9 16a2 2 0 114 0 2 2 0 01-4 0z"
							/>
						</svg>
					</button>
				</td>
			</tr>
		{/each}
	</TableView>
</MainPage>

<Dialog dialogId="person_modal" title="Uprawnienia dostępu" closeDialogOverride={closeDialog()}>
	{#if !selectedPerson?.fk_user_id}
		<p class="text-xl mb-3 font-semibold text-gray-700 dark:text-gray-200">
			Czy chcesz przyznać dostęp do dokumentacji jednostki użytkownikowi <b
				>{capitalizeEveryWord(selectedPerson?.name || '')}</b
			>?
		</p>
		<form id="email-form" method="dialog" on:submit={addAccess}>
			<label for="email">Adres email użytkownika</label>
			<input type="email" name="email" id="email" placeholder="jan.kowalski@example.com" required />
		</form>
		<div class="flex justify-center mt-5">
			<button
				form="email-form"
				class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
			>
				Tak, przyznaj
			</button>
			<form method="dialog" on:submit={closeDialog}>
				<button
					class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2 text-center"
				>
					Nie, anuluj
				</button>
			</form>
		</div>
	{/if}
	{#if selectedPerson?.fk_user_id}
		<p class="text-xl mb-3 font-semibold text-gray-700 dark:text-gray-200">
			Użytkownik <b>{capitalizeEveryWord(selectedPerson?.name || '')}</b> ma już dostęp do dokumentacji
			jednostki.
		</p>
		<div class="flex justify-center mt-5">
			<button
				class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
			>
				Zabierz dostęp
			</button>
			<button
				class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
				on:click={resetPassword}
			>
				Zresetuj hasło
			</button>
			<form method="dialog" on:submit={closeDialog}>
				<button
					class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2 text-center"
				>
					Anuluj
				</button>
			</form>
		</div>
	{/if}
</Dialog>
