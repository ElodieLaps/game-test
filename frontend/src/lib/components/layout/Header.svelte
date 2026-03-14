<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { userStore } from '$lib/stores/user.store';
</script>

<header class="">
	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href={resolve('/')}>Home</a>
			</li>
			{#if !$userStore}
				<li aria-current={page.url.pathname === '/login' ? 'page' : undefined}>
					<a href={resolve('/login')}>Login</a>
				</li>
				<li aria-current={page.url.pathname == '/register' ? 'page' : undefined}>
					<a href={resolve('/register')}>Register</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>
