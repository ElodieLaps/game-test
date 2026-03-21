<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { userStore } from '$lib/stores/user.store';
</script>

<header class="bg-glass border-b p-4 shadow-md lg:p-6">
	<nav>
		<ul class="flex gap-2 lg:gap-4">
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href={resolve('/')}>Home</a>
			</li>
			{#if $userStore}
				<li aria-current={page.url.pathname == '/characters' ? 'page' : undefined}>
					<a href={resolve('/characters')}>Personnages</a>
				</li>
				<li aria-current={page.url.pathname == '/teams' ? 'page' : undefined}>
					<a href={resolve('/teams')}>Equipes</a>
				</li>
				<li aria-current={page.url.pathname == '/inventory' ? 'page' : undefined}>
					<a href={resolve('/inventory')}>Inventaire</a>
				</li>
				<li aria-current={page.url.pathname == '/logout' ? 'page' : undefined}>
					<form method="POST" action="/logout">
						<button type="submit">Déconnexion</button>
					</form>
				</li>
			{/if}
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
