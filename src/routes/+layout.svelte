<script lang="ts">
	import { page } from '$app/stores';
	import '$lib/styles/theme.css';
	import '$lib/styles/main.css';
	import '$lib/styles/utility.css';
	import NavigationList from '$lib/components/navigation-list.svelte';
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
	import { is_large_screen, menu_expanded } from '$lib/app.js';

	export let data;
</script>

<div class="layout">
	<nav
		id="wiki-articles"
		aria-labelledby="menu-button"
		aria-hidden={!$is_large_screen && !$menu_expanded ? true : undefined}
	>
		<NavigationList>
			{#each data.navigation_items as item}
				<li>
					<a
						href={`/${item.slug}`}
						on:click={menu_expanded.set(false)}
						aria-current={(!$page.params.slug && item.slug === '') ||
						$page.params.slug === item.slug
							? 'page'
							: undefined}>{item.title}</a
					>
				</li>
			{/each}
		</NavigationList>
	</nav>
	<menu>
		<a href="/" class="logo"><span class="visually-hidden">Home</span></a>

		{#if $menu_expanded}
			<button
				id="menu-button"
				class="menu-toggle"
				aria-haspopup="menu"
				aria-controls="wiki-articles"
				aria-expanded={true}
				on:click={menu_expanded.set(false)}>Close</button
			>
		{:else}
			<button
				id="menu-button"
				class="menu-toggle"
				aria-haspopup="menu"
				aria-controls="wiki-articles"
				on:click={menu_expanded.set(true)}>Menu</button
			>
		{/if}

		<ThemeSwitcher />
	</menu>

	<main>
		<slot />
	</main>
</div>

<style>
	.layout {
		max-width: var(--max-width);
		margin: 0 auto 6rem;
		padding: 0 var(--gutter-width);
	}

	nav {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 5;

		border-right: 1px solid var(--theme-stroke);
		padding-top: var(--top-gutter);
		background: var(--theme-bg);
		transform: translateX(0);

		pointer-events: initial;
		transition: transform 200ms ease-in;
	}

	nav[aria-hidden='true'] {
		transition: transform 100ms ease-out;
		transform: translateX(-100%);
		pointer-events: none;
	}

	menu {
		position: fixed;
		bottom: var(--gutter-width);
		z-index: 10;
		display: flex;
		margin: 0;
		padding: 0;
		justify-content: space-between;
		align-items: center;
		background: var(--theme-panel);
		width: calc(100vw - var(--gutter-width) * 2);

		transition: background var(--color-transition-duration) ease-in-out;
	}

	nav[aria-hidden="true"] + menu .theme-switcher {
		display: none;
	}

	nav[aria-hidden="true"] + menu {
		width: auto;
	}

	.logo {
		display: none;
		width: 1.8125rem;
		height: 1.5rem;
		background-image: var(--logo);
	}

	.logo,
	:global(.light) .logo {
		--logo: url('/logo-alster.svg');
	}
	@media (prefers-color-scheme: dark) {
		.logo {
			--logo: url('/logo-alster_inverted.svg');
		}
	}
	:global(.dark) .logo {
		--logo: url('/logo-alster_inverted.svg');
	}

	main {
		padding-top: var(--top-gutter);
	}

	@media (min-width: 55em) {
		.layout {
			--top-gutter: 2rem;
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

			transition: background var(--color-transition-duration) ease-in-out;
		}

		menu {
			position: sticky;
			top: 0;
			grid-area: menu;
			width: auto;
		}

		.logo,
		.theme-switcher {
			display: initial;
		}

		nav {
			top: var(--header-height);
			right: unset;
			left: unset;
			grid-area: nav;
			pointer-events: initial;
			transition: none;
			transform: none;
			max-width: var(--aside-width);
			background: unset;
		}

		li:first-child {
			font-size: 1.25rem;
		}

		main {
			grid-area: main;
		}

		button {
			display: none;
		}
	}
</style>
