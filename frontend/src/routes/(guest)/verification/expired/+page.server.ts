import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return fail(400, { error: 'Veuillez entrer votre email.' });
		}

		try {
			const response = await fetch('http://ton-backend.com/auth/resend-verification', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					error: errorData.message || "Erreur lors de l'envoi du lien."
				});
			}

			return { success: true, message: 'Un nouveau lien de vérification a été envoyé.' };
		} catch (error) {
			return fail(500, { error: 'Une erreur est survenue.' });
		}
	}
};
