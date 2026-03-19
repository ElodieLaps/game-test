<script lang="ts">
	import Header from '@components/layout/Header.svelte';
	import './layout.css';
	import { userStore } from '$lib/stores/user.store';

	let { data, children } = $props();

	$effect(() => {
		userStore.set(data.user);
	});
</script>

<div class="app bg-mauve-700 text-olive-400">
	<Header />

	<main class="">
		{@render children()}
	</main>

	<footer>game - elodie - 2026</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
