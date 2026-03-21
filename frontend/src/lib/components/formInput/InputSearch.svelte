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
	};

	let { id, name, label, placeholder, value = $bindable(''), error, required }: Props = $props();
</script>

<Input {id} type="search" {name} {label} bind:value {placeholder} {error} {required} />
