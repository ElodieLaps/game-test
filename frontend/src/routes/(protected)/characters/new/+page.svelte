<script lang="ts">
	const { form } = $props();
</script>

<h1>Créer un personnage</h1>

<form method="POST">
	<input name="name" placeholder="Nom du personnage" required />
	<button type="submit">Créer</button>
</form>

{#if form?.error}
	<p style="color:red">{form.error}</p>
{/if}
