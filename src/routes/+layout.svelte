<script lang="ts">
	import { page } from '$app/stores';
	import 'prismjs/themes/prism.css';
	import '$lib/styles/main.css';
	import '$lib/styles/theme.css';
	import { onMount, type SvelteComponentTyped } from 'svelte';
	('$lib/components/theme-switcher.svelte');

	let ThemeSwitcher: SvelteComponentTyped | null = null;

	export let data;

	onMount(async () => {
		ThemeSwitcher = (await import(
			'$lib/components/theme-switcher.svelte'
		)) as unknown as SvelteComponentTyped;
	});
</script>

<div>
	<nav>
		{#if ThemeSwitcher}
			<menu>
				<svelte:component this={ThemeSwitcher.default} />
			</menu>
		{/if}
		<ul>
			{#each data.navigation_items as item}
				<li>
					<a
						href={`/${item.slug}`}
						aria-current={(!$page.params.slug && item.slug === '') ||
						$page.params.slug === item.slug
							? 'page'
							: undefined}>{item.title}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<main>
		<slot />
	</main>
</div>

<style>
	div {
		display: grid;
		grid-template-columns: 1fr 3fr;
		gap: 1em;
		max-width: 75em;
		margin: 0 auto;
	}

	a[aria-current='page'] {
		font-weight: bold;
	}
</style>
