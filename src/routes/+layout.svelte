<script lang="ts">
	import { page } from '$app/stores';
	import '$lib/styles/theme.css';
	import '$lib/styles/main.css';
	import '$lib/styles/utility.css';
	import NavigationList from '$lib/components/navigation-list.svelte';
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
	import { is_large_screen, menu_expanded } from '$lib/app.js';
	import ButtonMenuToggle from '$lib/components/button-menu-toggle.svelte';


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
		<ButtonMenuToggle class={'button-menu-toggle'} on:click={$menu_expanded ? menu_expanded.set(false) : menu_expanded.set(true)} open={$menu_expanded} />
		
		<ThemeSwitcher class={`theme-switcher${!$menu_expanded ? ' hidden' : ''}`} />
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
		transition: transform 200ms var(--ease-out);
	}

	nav[aria-hidden='true'] {
		transition: transform 200ms var(--ease-in);
		transform: translateX(-100%);
		pointer-events: none;
	}

	menu {
		position: fixed;
		bottom: var(--gutter-width);
		z-index: 10;
		display: flex;
		margin: 0;
		padding: 0 1.5rem;
		justify-content: space-between;
		align-items: center;
		background: var(--theme-panel);
		width: calc(100vw - var(--gutter-width) * 2);
		height: 4rem;

		transition-property: background, width;
		transition-duration: var(--color-transition-duration), 380ms;
		transition-timing-function: var(--ease) var(--ease-out);
	}

	nav[aria-hidden="true"] + menu {
		width: 4rem;
		transition-duration: var(--color-transition-duration), 300ms;
		transition-delay: 0ms, 200ms;
		transition-timing-function: var(--ease), var(--ease-out);
	}

	menu :global(.theme-switcher) {
		transform: translateY(0rem);
		opacity: 1;

		transition-property: opacity, transform;
		transition-duration: 100ms;
		transition-timing-function: var(--ease,) var(--ease);
		transition-delay: 450ms;		
	}

	menu :global(.theme-switcher.hidden) {
		opacity: 0;
		transform: translateY(0.125rem);

		pointer-events: none;
		transition-delay: 0ms;
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

		menu :global(.button-menu-toggle) {
			display: none;
		}

		menu :global(.theme-switcher), menu :global(.theme-switcher.hidden) {
			opacity: 1;
			pointer-events: all;
		}

		.logo {
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
	}
</style>
