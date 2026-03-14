<script lang="ts">
	let { data } = $props();
	const characters = $derived(data.characters);
</script>

<h1>Mes personnages</h1>

{#if characters.length === 0}
	<p>Vous n'avez pas encore de personnages.</p>
	<a href="/characters/new">Créer un personnage</a>
{:else}
	<ul>
		{#each characters as character}
			<li>
				<a href="/characters/{character.id}">
					{character.name} — {character.race}
					{character.role} (Niv. {character.level})
				</a>
			</li>
		{/each}
	</ul>
	<a href="/characters/new">Créer un personnage</a>
{/if}
