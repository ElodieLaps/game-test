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

				{#if team.inventory.items.equipments.length > 0 || team.inventory.items.consumables.length > 0}
					<div class="mt-1 flex flex-wrap gap-1">
						{#each team.inventory.items.equipments as equipment}
							<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
								>{equipment.name}</span
							>
						{/each}
						{#each team.inventory.items.consumables as consumable}
							<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
								>{consumable.name}</span
							>
						{/each}
					</div>
				{/if}
			</a>
		{/each}
	</div>
	<a href="/teams/new">Créer une équipe</a>
{/if}
