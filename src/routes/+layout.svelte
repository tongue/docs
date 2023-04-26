<script lang="ts">
	import { page } from '$app/stores';
	import 'prismjs/themes/prism.css';
	import '$lib/styles/main.css';
	import '$lib/styles/theme.css';
	import '$lib/styles/utility.css';
	import { onMount, type SvelteComponentTyped } from 'svelte';
	import NavigationList from '$lib/components/navigation-list.svelte';

	let ThemeSwitcher: SvelteComponentTyped | null = null;

	export let data;
	export let menu_expanded = true;

	const set_expanded = (expanded: boolean) => () => {
		document.body.classList.toggle('noscroll', expanded);
		menu_expanded = expanded;
	};

	onMount(async () => {
		ThemeSwitcher = (await import(
			'$lib/components/theme-switcher.svelte'
		)) as unknown as SvelteComponentTyped;
	});
</script>

<div class="layout">
	<menu class:expanded={menu_expanded}>
		{#if menu_expanded}
			<button on:click={set_expanded(false)}>Close</button>
		{:else}
			<button on:click={set_expanded(true)}>Menu</button>
		{/if}

		{#if ThemeSwitcher}
			<div>
				<svelte:component this={ThemeSwitcher.default} />
			</div>
		{/if}
	</menu>
	<nav class:expanded={menu_expanded}>
		<NavigationList>
			{#each data.navigation_items as item}
				<li>
					<a
						href={`/${item.slug}`}
						on:click={set_expanded(false)}
						aria-current={(!$page.params.slug && item.slug === '') ||
						$page.params.slug === item.slug
							? 'page'
							: undefined}>{item.title} and some more text</a
					>
				</li>
			{/each}
		</NavigationList>
	</nav>

	<main>
		<slot />
	</main>
</div>

<style>
	.layout {
		--top-gutter: 3rem;
		max-width: var(--max-width);
		margin: 0 auto 6rem;
		padding: 0 var(--gutter-width);
	}

	menu {
		position: fixed;
		bottom: var(--gutter-width);
		z-index: 10;
		display: flex;
		margin: 0;
		padding: 0;
		justify-content: space-between;
		background: var(--theme-panel);
	}

	menu.expanded {
		width: calc(100vw - var(--gutter-width) * 2);
	}

	menu > * + * {
		display: none;
	}

	menu.expanded > * + * {
		display: initial;
	}

	nav {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 5;

		transform: translateX(-100%);
		pointer-events: none;
		background: var(--theme-bg);
		transition: transform 100ms ease-out;

		border-right: 1px solid var(--theme-stroke);

		padding-top: var(--top-gutter);
	}

	nav.expanded {
		transform: translateX(0);
		pointer-events: initial;
		transition: transform 200ms ease-in;
	}

	main {
		padding-top: var(--top-gutter);
	}

	@media (min-width: 55em) {
		.layout {
			--top-gutter: 0;
			display: grid;
			grid-template-columns: var(--aside-width) auto;
			grid-template-rows: var(--header-height) auto;
			grid-template-areas:
				'menu menu'
				'nav main';
			gap: 0 var(--gap-width);
		}

		.layout::before {
			content: '';
			display: block;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			height: var(--header-height);
			background: var(--theme-panel);
		}

		menu,
		menu.expanded {
			position: sticky;
			top: 0;
			grid-area: menu;
			justify-content: flex-end;
			width: auto;
		}

		menu > * + * {
			display: initial;
		}

		nav,
		nav.expanded {
			top: var(--header-height);
			right: unset;
			left: unset;
			grid-area: nav;
			pointer-events: initial;
			transition: none;
			transform: none;
			max-width: var(--aside-width);
		}

		main {
			grid-area: main;
		}

		button {
			display: none;
		}
	}
</style>
