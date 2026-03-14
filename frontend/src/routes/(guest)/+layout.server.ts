import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) return {};

	// is valid token ?
	const res = await fetch('http://localhost:3000/user', {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!res.ok) {
		// is invalid token
		cookies.delete('token', { path: '/' });
		return {};
	}

	redirect(302, '/');
};
