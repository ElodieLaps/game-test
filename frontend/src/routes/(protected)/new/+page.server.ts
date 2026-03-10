import type { Actions } from '../../new/$types';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const formData = await request.formData();
    const name = formData.get('name');

    const token = cookies.get('token');

    const res = await fetch('http://localhost:3000/character', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
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