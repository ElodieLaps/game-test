<script lang="ts">
	type Level = 1 | 2 | 3 | 4 | 5 | 6;

	type Props = {
		level?: Level;
		class?: string;
		children?: any;
	};

	let { level = 1, class: className = '', children }: Props = $props();

	const styles: Record<Level, string> = {
		1: 'text-2xl font-medium',
		2: 'text-xl font-medium',
		3: 'text-lg font-medium',
		4: 'text-base font-medium',
		5: 'text-sm font-medium',
		6: 'text-xs font-medium'
	};
</script>

<svelte:element this={'h' + level} class="{styles[level as Level]} {className}">
	{@render children?.()}
</svelte:element>
