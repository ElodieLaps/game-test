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
		rows?: number;
        
	};

	let {
		id,
		name,
		label,
		placeholder,
		value = $bindable(''),
		rows,
		error,
		required
	}: Props = $props();
</script>

<Input {id} type="textarea" {name} {label} bind:value {placeholder} {rows} {error} {required} />
