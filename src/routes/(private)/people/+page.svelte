<script lang="ts">
	import type { PageData } from './$types';

	import ColorTag from '../../../lib/components/ColorTag.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import MainPage from '$lib/components/MainPage.svelte';
	import TableView from '$lib/components/TableView.svelte';
	import PersonAvatarText from '$lib/components/PersonAvatarText.svelte';
	export let data: PageData;
</script>

<MainPage
	title="Ewidencja harcerzy"
	subtitle="Lista harcerzy należących do drużyny"
	gotoUrl="/people/person_details"
	buttonName="Dodaj harcerza"
>
	<TableView labelList={['Imię i Nazwisko', 'Funkcja', 'Zastęp główny', 'Stopień']}>
		{#each data.people as person}
			<tr
				class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
				on:click={() => goto(`${$page.url}/person_details?id=${person.id}`)}
			>
				<PersonAvatarText picturesPromise={data.streamed.picturesList} {person} />
				<ColorTag color={person.roles?.color} title={person.roles?.name} />
				<td class="text-sm">{person.small_groups?.name || 'Brak zastępu'}</td>
				<ColorTag
					classes="pr-10"
					color={person.degrees?.color}
					title={person.degrees?.name ?? 'HBS'}
				/>
			</tr>
		{/each}
	</TableView>
</MainPage>
