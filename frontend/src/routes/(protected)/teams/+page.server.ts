import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { PRIVATE_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) redirect(302, '/login');

	const res = await fetch(`${PRIVATE_API_URL}/team`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	const teams = res.ok ? await res.json() : [];

	const inventories = await Promise.all(
		teams.map((team: any) =>
			fetch(`${PRIVATE_API_URL}/inventory/${team.id}`, {
				headers: { Authorization: `Bearer ${token}` }
			}).then((r) => (r.ok ? r.json() : { items: { equipments: [], consumables: [] } }))
		)
	);

	const teamsWithInventory = teams.map((team: any, i: number) => ({
		...team,
		inventory: inventories[i]
	}));

	return { teams: teamsWithInventory };
};
