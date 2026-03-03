<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	export let data: {
		users: { id: string; name: string; email: string }[];
	};

	const user = $userStore;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>home page</h1>

	<p>user connecté: {user.name}</p>

	{#each data.users as user}
		<li>{user.name} - {user.email}</li>
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
