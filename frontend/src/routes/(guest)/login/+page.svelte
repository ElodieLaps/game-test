<script lang="ts">
	import InputEmail from '@components/formInput/InputEmail.svelte';
	import InputPassword from '@components/formInput/InputPassword.svelte';
	import InputText from '@components/formInput/InputText.svelte';
	import Title from '@components/ui/Title.svelte';

	const { form } = $props();
</script>

<div>
	<Title class="Uppercase text-center uppercase">épistémè</Title>

	<form class="flex gap-6" method="POST" action="?/login">
		<InputEmail id="email" name="email" placeholder="email" label="Email" required />
		<InputPassword
			id="password"
			name="password"
			placeholder="Password"
			label="Mot de passe"
			required
		/>
		<button type="submit">Se connecter</button>
	</form>

	<form class="flex gap-6" method="POST" action="?/register">
		<InputText id="name" name="name" placeholder="name" label="Name" required />
		<InputEmail id="email" name="email" placeholder="email" label="Email" required />
		<InputPassword
			id="password"
			name="password"
			placeholder="Password"
			label="Mot de passe"
			required
		/>
		<button type="submit">Se connecter</button>
	</form>

	{#if form?.error}
		<p style="color:red">{form.error}</p>
	{/if}
</div>
