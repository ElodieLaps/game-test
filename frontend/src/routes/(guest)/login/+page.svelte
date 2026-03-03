<script lang="ts">
	const { form } = $props();
</script>

<h1>Login</h1>

<form method="POST" action="?/login">
	<input name="email" type="email" placeholder="email" required />
	<input name="password" type="password" placeholder="Password" required />
	<button type="submit">Se connecter</button>
</form>

{#if form?.error}
	<p style="color:red">{form.error}</p>
{/if}
