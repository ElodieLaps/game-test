<script lang="ts">
	import Gauge from '@components/ui/Gauge.svelte';
	import {
		allEquipments,
		getEquipmentsBySlotAndRole,
		statisticNames,
		type EquipmentSlotName
	} from '@shared';
	import { enhance } from '$app/forms';

	let { data } = $props();
	const character = $derived(data.character);

	let selectedSlot = $state<EquipmentSlotName | null>(null);

	const availableEquipments = $derived(
		selectedSlot ? getEquipmentsBySlotAndRole(selectedSlot, character.role) : []
	);
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
			{@const available = getEquipmentsBySlotAndRole(slot as EquipmentSlotName, character.role)}
			<div class="flex flex-col gap-1">
				<div class="flex justify-between text-sm">
					<span class="text-gray-500">{slot}</span>
					<div class="flex items-center gap-2">
						{#if item}
							<div class="flex flex-col items-end gap-0.5">
								<span class="font-medium">{item}</span>
								{#each allEquipments.find((e) => e.name === item)?.statistics ?? [] as stat}
									<span class="text-xs text-green-500">+{stat.value} {stat.name}</span>
								{/each}
							</div>
							<button
								type="button"
								class="text-xs text-red-400 hover:text-red-600"
								onclick={() =>
									(selectedSlot =
										selectedSlot === (slot as EquipmentSlotName)
											? null
											: (slot as EquipmentSlotName))}>changer</button
							>
							<form
								method="POST"
								action="?/removeEquipment"
								use:enhance={() => {
									return async ({ update }) => {
										await update();
										selectedSlot = null;
									};
								}}
							>
								<input type="hidden" name="slot" value={slot} />
								<button type="submit" class="text-xs text-gray-400 hover:text-red-400"
									>retirer</button
								>
							</form>
						{:else if available.length > 0}
							<span class="text-gray-400">—</span>
							<button
								type="button"
								class="text-xs text-blue-400 hover:text-blue-600"
								onclick={() =>
									(selectedSlot =
										selectedSlot === (slot as EquipmentSlotName)
											? null
											: (slot as EquipmentSlotName))}>équiper</button
							>
						{:else}
							<span class="text-xs text-gray-400 italic">non disponible</span>
						{/if}
					</div>
				</div>

				{#if selectedSlot === slot}
					<div
						class="flex flex-col gap-1 rounded-lg border border-gray-200 p-2 dark:border-gray-700"
					>
						{#if available.length === 0}
							<span class="text-xs text-gray-400">Aucun équipement disponible</span>
						{:else}
							{#each available as equipment}
								<form
									method="POST"
									action="?/addEquipment"
									use:enhance={() => {
										return async ({ update }) => {
											await update();
											selectedSlot = null;
										};
									}}
								>
									<input type="hidden" name="equipmentName" value={equipment.name} />
									<button
										type="submit"
										class="flex w-full justify-between text-sm hover:text-blue-500"
									>
										<span>{equipment.name}</span>
										<span class="text-xs text-green-500">
											{equipment.statistics.map((s) => `+${s.value} ${s.name}`).join(' · ')}
										</span>
									</button>
								</form>
							{/each}
						{/if}
					</div>
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
