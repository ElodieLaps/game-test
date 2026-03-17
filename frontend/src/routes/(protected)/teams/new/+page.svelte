<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const characters = $derived(data.characters);

	let selectedIds = $state<string[]>([]);

	const toggleCharacter = (id: string) => {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((i) => i !== id);
		} else if (selectedIds.length < 4) {
			selectedIds = [...selectedIds, id];
		}
	};
</script>

<h1>Créer une équipe</h1>

<form method="POST" use:enhance>
	<input name="name" placeholder="Nom de l'équipe" required />

	<div>
		<p>Personnages ({selectedIds.length}/4)</p>
		{#each characters as character}
			<div
				class="flex cursor-pointer items-center justify-between rounded p-2 {selectedIds.includes(
					character.id
				)
					? 'bg-blue-100 dark:bg-blue-900'
					: ''}"
				onclick={() => toggleCharacter(character.id)}
			>
				<span>{character.name}</span>
				<span class="text-sm text-gray-500"
					>{character.race} · {character.role} · Niv. {character.level}</span
				>
			</div>
		{/each}
	</div>

	{#each selectedIds as id}
		<input type="hidden" name="characterIds" value={id} />
	{/each}

	<button type="submit" disabled={selectedIds.length === 0}>Créer</button>
</form>

{#if form?.error}
	<p class="text-red-500">{form.error}</p>
{/if}
