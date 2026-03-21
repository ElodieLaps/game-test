<script lang="ts">
	import Input from './Input.svelte';

	type Props = {
		id: string;
		name: string;
		label?: string;
		placeholder?: string;
		value?: string;
		error?: string;
		required?: boolean;
		options: { value: string; label: string }[];
	};

	let {
		id,
		name,
		label,
		options,
		placeholder,
		value = $bindable(''),
		error,
		required
	}: Props = $props();
</script>

<Input {id} type="select" {name} {label} bind:value {options} {placeholder} {error} {required} />
