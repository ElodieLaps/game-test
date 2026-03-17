import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';
import { PRIVATE_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) redirect(302, '/login');

	const [teamRes, charactersRes] = await Promise.all([
		fetch(`${PRIVATE_API_URL}/team/${params.id}`, {
			headers: { Authorization: `Bearer ${token}` }
		}),
		fetch(`${PRIVATE_API_URL}/character`, {
			headers: { Authorization: `Bearer ${token}` }
		})
	]);

	if (!teamRes.ok) redirect(302, '/teams');

	const team = await teamRes.json();
	const characters = charactersRes.ok ? await charactersRes.json() : [];

	return { team, characters };
};

export const actions: Actions = {
	addCharacter: async ({ params, cookies, fetch, request }) => {
		const token = cookies.get('token');
		if (!token) redirect(302, '/login');

		const formData = await request.formData();
		const characterId = formData.get('characterId');

		await fetch(`${PRIVATE_API_URL}/team/${params.id}/addCharacters`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify([characterId])
		});
	},

	removeCharacter: async ({ params, cookies, fetch, request }) => {
		const token = cookies.get('token');
		if (!token) redirect(302, '/login');

		const formData = await request.formData();
		const characterId = formData.get('characterId');

		await fetch(`${PRIVATE_API_URL}/team/${params.id}/removeCharacters`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify([characterId])
		});
	}
};
