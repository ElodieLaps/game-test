<script lang="ts">
	import Header from '@components/layout/Header.svelte';
	import './layout.css';
	import { userStore } from '$lib/stores/user.store';

	let { data, children } = $props();

	$effect(() => {
		userStore.set(data.user);
	});
</script>

<div class="bg-main-gradient text-mist-400">
	<div class="flex min-h-screen flex-col sm:flex-col-reverse">
		<div class="flex flex-1 flex-col">
			<main class="flex-1 p-6">
				{@render children()}
			</main>
			<footer class="flex w-full justify-center bg-mauve-800 p-4">game - elodie - 2026</footer>
		</div>
		<div class="sticky bottom-0 sm:top-0">
			<Header />
		</div>
	</div>
</div>
