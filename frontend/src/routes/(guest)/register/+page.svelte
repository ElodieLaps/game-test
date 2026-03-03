<script lang="ts">
  const { form } = $props();
</script>

<h1>Créer un compte</h1>

<form method="POST">
  <input name="name" placeholder="Nom" required />
  <input name="email" type="email" placeholder="Email" required />
  <input name="password" type="password" placeholder="Mot de passe" required />
  <button type="submit">Créer mon compte</button>
</form>

{#if form?.error}
  <p style="color:red">{form.error}</p>
{/if}