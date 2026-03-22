<script lang="ts">
	import InputEmail from '@components/formInput/InputEmail.svelte';
	import InputPassword from '@components/formInput/InputPassword.svelte';
	import InputText from '@components/formInput/InputText.svelte';

	const { form } = $props();
</script>

<h1>Créer un compte</h1>
<form class="flex gap-6" method="POST">
	<InputText id="name" name="name" placeholder="name" label="Name" required />
	<InputEmail
		id="email"
		name="email"
		placeholder="email"
		label="Email"
		error={form?.error}
		required
	/>
	<InputPassword
		id="password"
		name="password"
		placeholder="Password"
		label="Mot de passe"
		required
	/>
	<InputPassword
		id="confirm_password"
		name="confirm_password"
		placeholder="Password"
		label="Confirmer le mot de passe"
		required
	/>
	<button type="submit">Se connecter</button>
</form>

{#if form?.error}
	<p style="color:red">{form.error}</p>
{/if}
