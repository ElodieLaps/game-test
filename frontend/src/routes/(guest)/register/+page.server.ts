import { PRIVATE_API_URL } from '$env/static/private';
import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');

		const registerRes = await fetch(`${PRIVATE_API_URL}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, password })
		});

		if (registerRes.status === 400) {
			return fail(400, { error: 'Un compte avec cet email existe déjà' });
		}

		if (!registerRes.ok) {
			return fail(400, { error: 'Erreur lors de la création du compte' });
		}

		// const loginRes = await fetch(`${PRIVATE_API_URL}/login`, {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ email, password })
		// });

		// if (!loginRes.ok) {
		// 	return fail(400, { error: 'Compte créé mais connexion échouée' });
		// }

		// const { token } = await loginRes.json();
		// cookies.set('token', token, {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV === 'production',
		// 	sameSite: 'lax',
		// 	maxAge: 60 * 60 * 24,
		// 	path: '/'
		// });

		redirect(302, '/home');
	}
};
