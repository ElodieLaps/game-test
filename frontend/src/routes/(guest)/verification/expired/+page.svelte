<!-- src/routes/verification/expired/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import InputEmail from '@components/formInput/InputEmail.svelte';

	const { form } = $props();
	let email: string = $state('');

	$effect(() => {
		const urlEmail = page.url.searchParams.get('email');
		if (urlEmail) {
			email = urlEmail;
		}
	});
</script>

<h1>Lien expiré</h1>
<p>Le lien de vérification a expiré.</p>

<form method="POST">
	<InputEmail
		id="email"
		name="email"
		bind:value={email}
		placeholder="Email"
		label="Email"
		error={form?.error}
		required
	/>
	<button type="submit">Recevoir un nouveau lien</button>
</form>

{#if form?.success}
	<p style="color:green">{form.message}</p>
{:else if form?.error}
	<p style="color:red">{form.error}</p>
{/if}
