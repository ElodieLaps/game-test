<script lang="ts">
	import Gauge from '@components/ui/Gauge.svelte';
	import { equipmentSlotNames, statisticNames, type Equipment, type Statistic } from '@shared';

	let { data } = $props();
	const { character } = $derived(data);
</script>

<h1>{character.name}</h1>
<p>Genre : {character.gender}</p>
<p>Race : {character.race}</p>
<p>Rôle : {character.role}</p>
<p>Niveau : {character.level}</p>

<div class="flex justify-around p-6">
	<div class="w-1/3">
		{#each statisticNames as name (name)}
			<Gauge
				{name}
				value={(character.statistics[name] as Statistic).value}
				currentValue={(character.statistics[name] as Statistic).currentValue}
			/>
		{/each}
	</div>
	<div class="w-1/3">
		{#each equipmentSlotNames as slot (slot)}
			<div
				class="flex items-start justify-between border-b border-gray-200 py-2 dark:border-gray-700"
			>
				<span class="text-secondary w-24 text-sm">{slot}</span>
				{#if character.equipments[slot]}
					{@const equipment = character.equipments[slot] as Equipment}
					<div class="flex flex-col items-end gap-1">
						<span class="text-sm font-medium">{equipment.name}</span>
						{#each equipment.statistics as stat}
							<span class="text-secondary text-xs">+{stat.value} {stat.name}</span>
						{/each}
					</div>
				{:else}
					<span class="text-secondary text-sm italic">—</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
<!-- <pre>{JSON.stringify(character, null, 2)}</pre> -->
