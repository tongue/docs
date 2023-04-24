<script lang="ts">
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'docs-theme';

	let theme: 'dark' | 'light' = matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';

	const handle_theme_switch = (new_theme: 'dark' | 'light') => () => {
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

	onMount(() => {
		const persisted_theme = localStorage.getItem(STORAGE_KEY);
		if ((persisted_theme === 'dark' || persisted_theme === 'light') && persisted_theme !== theme) {
			handle_theme_switch(persisted_theme)();
		}
	});
</script>

{#if theme === 'dark'}
	<button on:click={handle_theme_switch('light')}>Switch to Light theme</button>
{:else}
	<button on:click={handle_theme_switch('dark')}>Switch to Dark theme</button>
{/if}
