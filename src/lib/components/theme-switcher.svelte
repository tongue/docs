<script lang="ts">
	let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

	const hande_theme_switch = (new_theme: 'dark' | 'light') => () => {
		if (new_theme === 'dark') {
			document.body.classList.remove('light');
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
			document.body.classList.add('light');
		}

		theme = new_theme;
	};
</script>

{#if theme === 'dark'}
	<button on:click={hande_theme_switch('light')}>Switch to Light theme</button>
{:else}
	<button on:click={hande_theme_switch('dark')}>Switch to Dark theme</button>
{/if}
