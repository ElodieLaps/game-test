import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { PRIVATE_API_URL } from '$env/static/private';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const token = cookies.get('token');
		if (!token) redirect(302, '/login');

		const formData = await request.formData();
		const name = formData.get('name');
		const gender = formData.get('gender');
		const race = formData.get('race');
		const role = formData.get('role');
		const customStatisticsRaw = formData.get('customStatistics');

		if (!name || !gender || !race || !role || !customStatisticsRaw) {
			return fail(400, { error: 'Tous les champs sont requis' });
		}

		let customStatistics;
		try {
			customStatistics = JSON.parse(customStatisticsRaw as string);
		} catch {
			return fail(400, { error: 'Statistiques invalides' });
		}

		const res = await fetch(`${PRIVATE_API_URL}/character`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ name, gender, race, role, customStatistics })
		});

		if (res.status === 400) {
			return fail(400, { error: 'Vous ne pouvez pas avoir plus de 12 personnages' });
		}

		if (!res.ok) {
			return fail(500, { error: 'Erreur lors de la création du personnage' });
		}

		const character = await res.json();
		redirect(302, `/characters/${character.id}`);
	}
};
