<script lang="ts">
	import {
		genderNames,
		raceNames,
		roleNames,
		statisticNames,
		CREATION_POINTS,
		baseStatistics,
		type GenderName,
		type RaceName,
		type RoleName,
		type StatisticName
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

	let customStatistics = $state<Partial<Record<StatisticName, number>>>(
		Object.fromEntries(statisticNames.map((s) => [s, 0]))
	);

	const totalPoints = $derived(Object.values(customStatistics).reduce((a, b) => a + b, 0));
	const remainingPoints = $derived(CREATION_POINTS[character.race] - totalPoints);

	const getBaseValue = (statName: StatisticName) =>
		baseStatistics[character.race].statistics[statName]?.value ?? 0;

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

	<div>
		<p>Points restants : {remainingPoints} / {CREATION_POINTS[character.race]}</p>
		{#each statisticNames as statName}
			<div class="flex items-center gap-2">
				<span class="w-32">{statName}</span>
				<button
					type="button"
					onclick={() => {
						if ((customStatistics[statName] ?? 0) > 0)
							customStatistics[statName] = (customStatistics[statName] ?? 0) - 1;
					}}>-</button
				>
				<span>
					{getBaseValue(statName) + (customStatistics[statName] ?? 0)}
				</span>
				<button
					type="button"
					onclick={() => {
						if (remainingPoints > 0)
							customStatistics[statName] = (customStatistics[statName] ?? 0) + 1;
					}}>+</button
				>
				<span class="text-xs text-gray-400">
					({getBaseValue(statName)} + {customStatistics[statName] ?? 0})
				</span>
			</div>
		{/each}
	</div>

	<input type="hidden" name="customStatistics" value={JSON.stringify(customStatistics)} />

	<button type="submit" disabled={remainingPoints !== 0}>Créer</button>
</form>

{#if form?.error}
	<p style="color:red">{form.error}</p>
{/if}
