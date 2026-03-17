import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { PRIVATE_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) redirect(302, '/login');

	const res = await fetch(`${PRIVATE_API_URL}/character`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	const characters = res.ok ? await res.json() : [];
	return { characters };
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const token = cookies.get('token');
		if (!token) redirect(302, '/login');

		const formData = await request.formData();
		const name = formData.get('name');
		const characterIds = formData.getAll('characterIds');

		if (!name) return fail(400, { error: 'Le nom est requis' });
		if (characterIds.length > 4)
			return fail(400, { error: 'Une équipe ne peut pas avoir plus de 4 personnages' });

		const res = await fetch(`${PRIVATE_API_URL}/team`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({ name })
		});

		if (!res.ok) return fail(500, { error: "Erreur lors de la création de l'équipe" });

		const team = await res.json();

		if (characterIds.length > 0) {
			await fetch(`${PRIVATE_API_URL}/team/${team.id}/addCharacters`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify(characterIds)
			});
		}

		redirect(302, `/teams/${team.id}`);
	}
};
