import { json } from '@sveltejs/kit';
import { getPersonTeam } from '../shared';

// For some reason, Jimp attaches to self, even in Node.
// https://github.com/jimp-dev/jimp/issues/466
import * as _Jimp from 'jimp';
// @ts-expect-error For some reason, Jimp attaches to self, even in Node.
const Jimp = (typeof self !== 'undefined') ? (self.Jimp || _Jimp) : _Jimp;

async function parseToJPG(image: Buffer): Promise<Buffer> {
	const img = await Jimp.read(image).catch((err) => {
		console.error(err);
		return null;
	});
	return await img.getBufferAsync(Jimp.MIME_JPEG);
}

export async function POST({
	request,
	params,
	locals: { supabase }
}): Promise<{ status: number; body }> {
	const formData = await request.formData();
	const person_id = params.id;

	const body = Object.fromEntries(formData.entries());
	if (!body) return json({ status: 400, body: 'Błąd wewnętrzny - żądanie jest puste' });
	const file = body.file_to_upload;
	if (!(file as File).name || (file as File).name === 'undefined') {
		return json({ status: 400, body: 'Błąd - nie wybrano pliku' });
	}
	const team_id = await getPersonTeam(person_id, supabase);
	const fileToUpload = await parseToJPG(Buffer.from(await (file as File).arrayBuffer()));
	const { error } = await supabase.storage
		.from('avatars')
		.upload(`${team_id}/${person_id}.jpg`, fileToUpload, {
			cacheControl: '3600',
			upsert: true,
			contentType: (file as File).type
		});
	if (error) return json({ status: 500, body: error });
	return json({ status: 200, body: file });
}

export async function DELETE({ params, locals: { supabase } }): Promise<{ status: number; body }> {
	const person_id = params.id;

	const team_id = await getPersonTeam(person_id, supabase);
	const { error } = await supabase.storage.from('avatars').remove([`${team_id}/${person_id}.jpg`]);
	if (error) return json({ status: 500, body: error });
	return json({ status: 204 });
}
