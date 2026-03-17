<script lang="ts">
	let { data } = $props();
	const teams = $derived(data.teams);
</script>

<h1>Mes équipes</h1>

{#if teams.length === 0}
	<p>Vous n'avez pas encore d'équipe.</p>
	<a href="/teams/new">Créer une équipe</a>
{:else}
	<div class="flex flex-col gap-4">
		{#each teams as team}
			<a
				href="/teams/{team.id}"
				class="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
			>
				<h2 class="font-medium">{team.name}</h2>
				<div class="flex gap-2">
					{#each team.characters as character}
						<span class="text-sm text-gray-500">{character.name} · {character.role}</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>
	<a href="/teams/new">Créer une équipe</a>
{/if}
