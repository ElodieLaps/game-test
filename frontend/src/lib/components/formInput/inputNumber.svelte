<script lang="ts">
	import Input from './Input.svelte';

	type Props = {
		id: string;
		name: string;
		label?: string;
		placeholder?: string;
		value?: string;
		error?: string;
		min?: number;
		max?: number;
		required?: boolean;
	};

	let {
		id,
		name,
		label,
		placeholder,
		value = $bindable(''),
		min,
		max,
		error,
		required
	}: Props = $props();

	const decrement = () => (value = Math.max(min ?? -Infinity, Number(value) - 1).toString());
	const increment = () => (value = Math.min(max ?? Infinity, Number(value) + 1).toString());
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label for={id} class="text-sm font-medium">
			{label}
			{#if required}<span aria-hidden="true" class="text-red-500"> *</span>{/if}
		</label>
	{/if}

	<div class="flex items-center gap-1">
		<button
			type="button"
			onclick={decrement}
			disabled={min !== undefined && Number(value) <= min}
			aria-label="Diminuer"
			class="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:hover:bg-gray-800"
			>−</button
		>

		<Input {id} type="number" {name} bind:value {placeholder} {error} {required} {min} {max} />

		<button
			type="button"
			onclick={increment}
			disabled={max !== undefined && Number(value) >= max}
			aria-label="Augmenter"
			class="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:hover:bg-gray-800"
			>+</button
		>
	</div>

	{#if error}
		<p id="{id}-error" role="alert" class="text-xs text-red-500">{error}</p>
	{/if}
</div>
