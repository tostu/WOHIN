import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { createAuth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	// For local development with 'vite dev', platform might be missing
	// If it is missing, we check if we should throw or provide a mock/local fallback
	const db = event.platform?.env?.DB;
	
	if (!db) {
		if (!building) {
			console.warn('D1 binding "DB" not found - running in mock/local mode if possible');
			// In a real local setup, you might want to use a local sqlite db here
		}
		// If we don't have a DB, Better Auth will fail if we try to use it
		// For the sake of this discovery demo, we can proceed but auth features will fail
		return resolve(event);
	}

	event.locals.auth = createAuth(db);

	const { auth } = event.locals;
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleParaglide, handleBetterAuth);
