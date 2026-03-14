<script lang="ts">
	import {
		genderNames,
		raceNames,
		roleNames,
		type GenderName,
		type RaceName,
		type RoleName
	} from '@shared';

	type Character = {
		name: string;
		gender: GenderName;
		race: RaceName;
		role: RoleName;
	};

	let character = $state<Character>({
		name: '',
		gender: 'MALE',
		race: 'HUMAN',
		role: 'WARRIOR'
	});

	const { form } = $props();
</script>

<h1>Créer un personnage</h1>

<form method="POST">
	<input name="name" bind:value={character.name} placeholder="Nom du personnage" required />

	<select name="gender" bind:value={character.gender}>
		{#each genderNames as gender}
			<option value={gender}>{gender}</option>
		{/each}
	</select>

	<select name="race" bind:value={character.race}>
		{#each raceNames as race}
			<option value={race}>{race}</option>
		{/each}
	</select>

	<select name="role" bind:value={character.role}>
		{#each roleNames as role}
			<option value={role}>{role}</option>
		{/each}
	</select>

	<button type="submit">Créer</button>
</form>

{#if form?.error}
	<p style="color:red">{form.error}</p>
{/if}