import { redirect, type Handle, error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { building } from '$app/environment';

const privateRoutePrefix = '/(private)';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.supabaseService = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PRIVATE_SUPABASE_SERVICE_ROLE_KEY,
		event
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	event.locals.getServiceSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabaseService.auth.getSession();
		return session;
	};

	if (building) {
		const response = await resolve(event);
		return response;
	}

	if (event.route.id === null) {
		throw error(404, 'What are you looking for?');
	}

	if (event.route.id.startsWith(privateRoutePrefix)) {
		const session = await event.locals.getSession();
		if (!session) {
			// the user is not signed in
			throw redirect(307, '/');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

(async () => {})().catch((reason) => {
	console.error('startup failed: ', reason);
});
