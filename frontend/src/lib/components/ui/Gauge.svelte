<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	type Props = {
		name: string;
		value: number;
		currentValue: number;
	};

	let { name, value, currentValue }: Props = $props();

	const percentage = new Tween(0, { duration: 400, easing: cubicOut });
	let damaged = $state(false);
	let previousValue = $derived(currentValue);

	$effect(() => {
		const newPercentage = Math.round((currentValue / value) * 100);
		percentage.set(newPercentage);

		if (currentValue < previousValue) {
			damaged = true;
			setTimeout(() => (damaged = false), 600);
		}
		previousValue = currentValue;
	});
</script>

<div class="flex flex-col gap-1.5">
	<div class="flex justify-between text-sm">
		<span class="text-secondary">{name}</span>
		<span class="font-medium">{currentValue} / {value}</span>
	</div>
	<div class="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
		<div
			class="h-full rounded-full transition-colors duration-500"
			class:bg-purple-500={!damaged}
			class:bg-red-500={damaged}
			style="width: {percentage.current}%"
		></div>
	</div>
</div>
