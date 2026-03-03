import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const res = await fetch('http://localhost:3000/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!res.ok) {
			return fail(400, { error: 'Invalid credentials' });
		}

		const { token } = await res.json();

		cookies.set('token', token, {
			httpOnly: true,
			secure: false, // secure: process.env.NODE_ENV === 'production', // false en dev, true en prod
			sameSite: 'lax',
			maxAge: 60 * 60 * 24,
			path: '/'
		});

		redirect(302, '/');
	}
};
