<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const inventory = $derived((data as any).inventory);
</script>

<div class="flex flex-col gap-6">
	<h1 class="text-2xl font-medium">Inventaire</h1>

	<!-- EQUIPEMENTS -->
	<div class="flex flex-col gap-3">
		<h2 class="text-sm font-medium tracking-wide text-gray-400 uppercase">Équipements</h2>
		{#if inventory.items.equipments.length === 0}
			<p class="text-sm text-gray-400">Aucun équipement.</p>
		{:else}
			{#each inventory.items.equipments as equipment}
				<div
					class="flex justify-between rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700"
				>
					<span class="font-medium">{equipment.name}</span>
					<span class="text-gray-500">x{equipment.quantity}</span>
				</div>
			{/each}
		{/if}
	</div>

	<!-- CONSOMMABLES -->
	<div class="flex flex-col gap-3">
		<h2 class="text-sm font-medium tracking-wide text-gray-400 uppercase">Consommables</h2>
		{#if inventory.items.consumables.length === 0}
			<p class="text-sm text-gray-400">Aucun consommable.</p>
		{:else}
			{#each inventory.items.consumables as consumable}
				<div
					class="flex justify-between rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700"
				>
					<span class="font-medium">{consumable.name}</span>
					<span class="text-gray-500">x{consumable.quantity}</span>
				</div>
			{/each}
		{/if}
	</div>
</div>
