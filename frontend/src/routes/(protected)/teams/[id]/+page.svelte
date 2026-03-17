<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const team = $derived((data as PageData).team);
	const availableCharacters = $derived(
		((data as any).characters ?? []).filter((c: any) => !c.teamId || c.teamId === team.id)
	);
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-1">
		<h1 class="text-2xl font-medium">{team.name}</h1>
		<p class="text-sm text-gray-500">{team.characters.length} / 4 personnages</p>
	</div>

	<!-- MEMBRES -->
	<div class="flex flex-col gap-3">
		<h2 class="text-sm font-medium tracking-wide text-gray-400 uppercase">Membres</h2>
		{#if team.characters.length === 0}
			<p class="text-sm text-gray-400">Aucun personnage dans cette équipe.</p>
		{:else}
			{#each team.characters as character}
				<div
					class="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
				>
					<a href="/characters/{character.id}" class="flex flex-col gap-0.5 hover:text-blue-500">
						<span class="font-medium">{character.name}</span>
						<span class="text-xs text-gray-500"
							>{character.race} · {character.role} · Niv. {character.level}</span
						>
					</a>
					<form method="POST" action="?/removeCharacter" use:enhance>
						<input type="hidden" name="characterId" value={character.id} />
						<button type="submit" class="text-xs text-red-400 hover:text-red-600">retirer</button>
					</form>
				</div>
			{/each}
		{/if}
	</div>

	<!-- AJOUTER -->
	{#if team.characters.length < 4}
		<div class="flex flex-col gap-3">
			<h2 class="text-sm font-medium tracking-wide text-gray-400 uppercase">
				Ajouter un personnage
			</h2>
			{#each availableCharacters.filter((c: any) => !team.characters.find((m: any) => m.id === c.id)) as character}
				<div
					class="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
				>
					<div class="flex flex-col gap-0.5">
						<span class="font-medium">{character.name}</span>
						<span class="text-xs text-gray-500"
							>{character.race} · {character.role} · Niv. {character.level}</span
						>
					</div>
					<form method="POST" action="?/addCharacter" use:enhance>
						<input type="hidden" name="characterId" value={character.id} />
						<button type="submit" class="text-xs text-blue-400 hover:text-blue-600">ajouter</button>
					</form>
				</div>
			{/each}
		</div>
	{/if}
</div>
