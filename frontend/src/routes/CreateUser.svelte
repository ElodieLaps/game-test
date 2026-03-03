<script lang="ts">
	let name = '';
	let email = '';
	let password = '';

	async function createUser() {
		const res = await fetch('http://localhost:3000/user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				email,
				password
			})
		});

		if (!res.ok) {
			console.error('Error creating user');
			return;
		}

		const user = await res.json();
	}
</script>

<form on:submit|preventDefault={createUser}>
	<input placeholder="Name" bind:value={name} />
	<input placeholder="Email" bind:value={email} />
	<input type="password" placeholder="Password" bind:value={password} />
	<button type="submit">Create user</button>
</form>
