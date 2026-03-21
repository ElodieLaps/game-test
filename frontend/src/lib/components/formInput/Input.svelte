<script lang="ts">
	type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

	type Props = {
		id: string;
		name: string;
		type?: InputType | 'select' | 'textarea';
		label?: string;
		placeholder?: string;
		value?: string | number;
		error?: string;
		required?: boolean;
		options?: { value: string; label: string }[];
		rows?: number;
		min?: number;
		max?: number;
	};

	let {
		id,
		name,
		type = 'text',
		label,
		placeholder = '',
		value = $bindable(''),
		error,
		required = false,
		options = [],
		rows = 3,
		min,
		max
	}: Props = $props();

	let visible = $state(false);
	const inputType = $derived(type === 'password' && visible ? 'text' : type);

	const baseClass = $derived(
		`bg-glass w-full text-white rounded-lg border px-3 py-2 text-sm caret-purple-500 
        focus:outline-none focus:ring-2 focus:ring-purple-500 
        ${error ? 'border-red-500' : 'border-mist-400 dark:border-mist-500'}`
	);
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label for={id} class="text-sm font-medium">
			{label}
			{#if required}<span aria-hidden="true" class="text-red-500"> *</span>{/if}
		</label>
	{/if}

	{#if type === 'select'}
		<select
			{id}
			{name}
			bind:value
			{required}
			aria-required={required}
			aria-invalid={!!error}
			aria-describedby={error ? `${id}-error` : undefined}
			class={baseClass}
		>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	{:else if type === 'textarea'}
		<textarea
			{id}
			{name}
			bind:value
			{placeholder}
			{required}
			{rows}
			aria-required={required}
			aria-invalid={!!error}
			aria-describedby={error ? `${id}-error` : undefined}
			class={baseClass}
		></textarea>
	{:else}
		<div class="relative flex items-center">
			<input
				{id}
				{name}
				type={inputType}
				bind:value
				{placeholder}
				{required}
				{min}
				{max}
				aria-required={required}
				aria-invalid={!!error}
				aria-describedby={error ? `${id}-error` : undefined}
				autocomplete={type === 'password'
					? 'current-password'
					: type === 'email'
						? 'email'
						: undefined}
				class="{baseClass} {type === 'password' ? 'pr-10' : ''}"
			/>

			{#if type === 'password'}
				<button
					type="button"
					onclick={() => (visible = !visible)}
					aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
					aria-controls={id}
					class="absolute right-2 text-gray-400 hover:text-white"
				>
					{#if visible}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path
								d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
							/>
							<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
							<line x1="1" y1="1" x2="23" y2="23" />
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
					{/if}
				</button>
			{/if}
		</div>
	{/if}

	{#if error}
		<p id="{id}-error" role="alert" class="text-xs text-red-500">{error}</p>
	{/if}
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
	}

	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
