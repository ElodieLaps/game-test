import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';
import { PRIVATE_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
	const token = cookies.get('token');
	if (!token) redirect(302, '/login');

	const res = await fetch(`${PRIVATE_API_URL}/character/${params.id}`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!res.ok) redirect(302, '/');

	const character = await res.json();
	return { character };
};

export const actions: Actions = {
	addEquipment: async ({ params, cookies, fetch, request }) => {
		const token = cookies.get('token');
		if (!token) redirect(302, '/login');

		const formData = await request.formData();
		const equipmentName = formData.get('equipmentName');

		await fetch(`${PRIVATE_API_URL}/character/${params.id}/equipments/add`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify([equipmentName])
		});
	},

	removeEquipment: async ({ params, cookies, fetch, request }) => {
		const token = cookies.get('token');
		if (!token) redirect(302, '/login');

		const formData = await request.formData();
		const slot = formData.get('slot');

		await fetch(`${PRIVATE_API_URL}/character/${params.id}/equipments/remove`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify([slot])
		});
	}
};
