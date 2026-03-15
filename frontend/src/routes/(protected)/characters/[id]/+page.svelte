<script lang="ts">
	import Gauge from '@components/ui/Gauge.svelte';
	import { allEquipments, statisticNames } from '@shared';

	let { data } = $props();
	const character = $derived(data.character);
</script>

<div class="flex flex-col gap-6">
	<!-- INFOS -->
	<div class="flex flex-col gap-1">
		<h1 class="text-2xl font-medium">{character.name}</h1>
		<p class="text-sm text-gray-500">
			{character.race} · {character.role} · {character.gender} · Niveau {character.level}
		</p>
	</div>

	<!-- VITAUX -->
	<div class="flex flex-col gap-3">
		<h2 class="text-sm font-medium tracking-wide text-gray-400 uppercase">Vital</h2>
		<Gauge
			name="Vie"
			value={character.computedStats.HEALTH.total}
			currentValue={character.currentHealth}
		/>
		<Gauge
			name="Mana"
			value={character.computedStats.MANA.total}
			currentValue={character.currentMana}
		/>
		<Gauge
			name="Expérience"
			value={character.experienceToNextLevel}
			currentValue={character.currentExperience}
		/>
	</div>

	<!-- STATS -->
	<div class="flex flex-col gap-3">
		<h2 class="text-sm font-medium tracking-wide text-gray-400 uppercase">Statistiques</h2>
		{#each statisticNames.filter((s) => !['HEALTH', 'MANA'].includes(s)) as statName}
			{#if character.computedStats[statName]}
				<div class="flex justify-between text-sm">
					<span class="text-gray-500">{statName}</span>
					<span class="font-medium">{character.computedStats[statName].total}</span>
				</div>
			{/if}
		{/each}
	</div>

	<!-- EQUIPEMENTS -->
	<div class="flex flex-col gap-2">
		<h2 class="text-sm font-medium tracking-wide text-gray-400 uppercase">Équipements</h2>
		{#each Object.entries(character.equipments) as [slot, item]}
			<div class="flex justify-between text-sm">
				<span class="text-gray-500">{slot}</span>
				{#if item}
					<div class="flex flex-col items-end gap-0.5">
						<span class="font-medium">{item}</span>
						{#each allEquipments.find((e) => e.name === item)?.statistics ?? [] as stat}
							<span class="text-xs text-green-500">+{stat.value} {stat.name}</span>
						{/each}
					</div>
				{:else}
					<span class="font-medium text-gray-400">—</span>
				{/if}
			</div>
		{/each}
	</div>

	<!-- STATUTS -->
	{#if character.statuses.length > 0}
		<div class="flex flex-col gap-2">
			<h2 class="text-sm font-medium tracking-wide text-gray-400 uppercase">Statuts</h2>
			<div class="flex flex-wrap gap-2">
				{#each character.statuses as status}
					<span class="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">{status}</span>
				{/each}
			</div>
		</div>
	{/if}
</div>
