import { getPicturesList } from '$lib/server/getPicturesList';
import { redirect } from '@sveltejs/kit';

async function getFeesType(fee_type_id, supabase) {
	const { data: fees_types, error } = await supabase
		.from('fees_types')
		.select('fk_small_group_id, name, amount, count_finance, start_date, is_formal')
		.eq('id', parseInt(fee_type_id));
	if (error) throw error;
	if (!fees_types || fees_types.length === 0) return null;
	return fees_types[0];
}

async function getFees(supabase, fee_type_id) {
	const { data: fees, error } = await supabase
		.from('fees')
		.select('*')
		.eq('fk_fee_type_id', parseInt(fee_type_id));
	if (error) throw error;
	return fees || [];
}

async function getPeople(supabase) {
	const { data: people, error } = await supabase
		.from('people')
		.select('id, name, join_year, roles (name, color), degrees (name, color), small_groups (name)');
	if (error) throw error;
	return people || [];
}

async function getGroupPerson(group_id: string | null, supabase) {
	if (!group_id) return {};
	const { data: group_person, error } = await supabase
		.from('group_person')
		.select('*')
		.eq('fk_small_group_id', group_id);
	if (error) throw error;
	return group_person || [];
}

export async function load({ locals: { supabase, getSession }, url }) {
	if (!url.searchParams.has('id')) {
		return redirect(302, '/fees');
	}
	let people = await getPeople(supabase);

	const fee_type = await getFeesType(url.searchParams.get('id'), supabase);
	if (fee_type.fk_small_group_id) {
		const group_person = await getGroupPerson(fee_type.fk_small_group_id, supabase);
		people = people.filter((person) => group_person.includes(person.id));
	}

	const fees = await getFees(supabase, url.searchParams.get('id'));

	const picturesList = await getPicturesList(supabase, getSession);

	return { fee_type, people, fees, streamed: { picturesList } };
}
