import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { PRIVATE_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) redirect(302, '/login');

	const res = await fetch(`${PRIVATE_API_URL}/character`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!res.ok) return { characters: [] };

	const characters = await res.json();
	return { characters };
};
