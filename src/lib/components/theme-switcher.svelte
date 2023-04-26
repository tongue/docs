<script lang="ts">
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'docs-theme';

	let theme: 'dark' | 'light' = matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';

	const handle_theme_switch = (new_theme: 'dark' | 'light') => {
		if (new_theme === 'dark') {
			document.body.classList.remove('light');
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
			document.body.classList.add('light');
		}
		localStorage.setItem(STORAGE_KEY, new_theme);
		theme = new_theme;
	};

	const on_change = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			handle_theme_switch('dark');
		} else {
			handle_theme_switch('light');
		}
	};

	onMount(() => {
		const persisted_theme = localStorage.getItem(STORAGE_KEY);
		if ((persisted_theme === 'dark' || persisted_theme === 'light') && persisted_theme !== theme) {
			handle_theme_switch(persisted_theme);
		}
	});
</script>

<label>
	<input
		type="checkbox"
		id="toggle-dark-theme"
		checked={theme === 'dark'}
		on:change|preventDefault={on_change}
	/>
	<span class="switch"
		><span>
			<span class="visually-hidden">Toggle "dark theme"</span>
		</span></span
	></label
>

<style>
	label {
		display: flex;
		align-items: center;
		cursor: pointer;
		gap: 0.75rem;
	}

	label,
	:global(.light) label {
		--icon: url(/icons/lightbulb.svg);
	}
	@media (prefers-color-scheme: dark) {
		label {
			--icon: url(/icons/lightbulb_inverted.svg);
		}
	}
	:global(.dark) label {
		--icon: url(/icons/lightbulb_inverted.svg);
	}

	label::after {
		content: '';
		display: block;
		height: 1rem;
		width: 1rem;
		background-image: var(--icon);
	}

	input {
		display: none;
	}

	.switch {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 1.5rem;
		background-color: var(--theme-track);
		border-radius: 1rem;
	}

	.switch::before {
		content: '';
		display: block;
		width: 1rem;
		height: 1rem;
		border-radius: 100%;
		background-color: var(--theme-fg);
		box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.12);
		transition: transform 200ms ease-in-out;
		transform: translateX(50%);
	}

	input:checked + .switch::before {
		transform: translateX(-50%);
	}
</style>
