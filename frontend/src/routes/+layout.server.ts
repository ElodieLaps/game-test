import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('token');

	if (!token) {
		return { isLogged: false, user: null };
	}

	try {
		const res = await fetch('http://localhost:3000/user', {
			headers: {
				Authorization: `Bearer ${token}`
			},
			credentials: 'include'
		});

		if (!res.ok) return { isLogged: false, user: null };

		const user = await res.json();
		return { isLogged: true, user };
	} catch {
		return { isLogged: false, user: null };
	}
};
