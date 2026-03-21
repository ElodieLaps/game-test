<script lang="ts">
	import Header from '@components/layout/Header.svelte';
	import './layout.css';
	import { userStore } from '$lib/stores/user.store';

	let { data, children } = $props();

	$effect(() => {
		userStore.set(data.user);
	});
</script>

<div class="min-h-screen bg-main-gradient text-mist-400">
	<div class="flex flex-col sm:flex-col-reverse">
		<div>
			<main class="p-6">
				{@render children()}
			</main>
			<footer class="absolute bottom-0 flex w-screen justify-center bg-mauve-800 p-4">
				game - elodie - 2026
			</footer>
		</div>
		<div class="sticky bottom-0 sm:top-0">
			<Header />
		</div>
	</div>
</div>
