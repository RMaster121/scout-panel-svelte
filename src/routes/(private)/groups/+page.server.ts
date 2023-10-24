export async function load({ locals: { supabase } }) {
    //supabase fetch groups
    const { data: groups, error } = await supabase.from('small_groups').select('*').order('name');
    if (error) throw error;
    return { groups };
};