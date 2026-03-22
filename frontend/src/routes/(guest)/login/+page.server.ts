import { PRIVATE_API_URL } from '$env/static/private';
import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const res = await fetch(`${PRIVATE_API_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!res.ok) {
			return fail(401, { error: 'Invalid credentials' });
		}

		const { token } = await res.json();

		cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24,
			path: '/'
		});

		redirect(302, '/characters');
	}
};
