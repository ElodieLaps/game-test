import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { PRIVATE_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies, fetch, parent }) => {
	const token = cookies.get('token');
	if (!token) redirect(302, '/login');

	const { user } = await parent();

	const res = await fetch(`${PRIVATE_API_URL}/inventory/${user.id}`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	const inventory = res.ok ? await res.json() : { items: { equipments: [], consumables: [] } };
	return { inventory };
};
