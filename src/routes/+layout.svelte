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
			{#each data.navigation_items as item, index}
				<li>
					<a
						href={`${index > 0 ? '/articles' : ''}/${item.slug}`}
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
		<section>
			<a href="/" class="logo"><span class="visually-hidden">Home</span></a>
			<ButtonMenuToggle
				class={'button-menu-toggle'}
				on:click={$menu_expanded ? menu_expanded.set(false) : menu_expanded.set(true)}
				open={$menu_expanded}
			/>
			<ThemeSwitcher class={`theme-switcher${!$menu_expanded ? ' hidden' : ''}`} />
		</section>
	</menu>
	<main>
		<slot />
	</main>
</div>

<style>
	.layout {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 0 var(--gutter-width);
	}

	nav {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 5;

		border-right: 0.25rem solid var(--theme-panel);
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
		margin: 0;
		padding: 0;
		background-color: var(--theme-panel);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		width: calc(100vw - var(--gutter-width) * 2);

		transition-property: background-color, width;
		transition-duration: var(--color-transition-duration), 380ms;
		transition-timing-function: var(--ease) var(--ease-out);
	}

	section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 4rem;
	}

	nav[aria-hidden='true'] + menu {
		width: 4.5rem;
		transition-duration: var(--color-transition-duration), 300ms;
		transition-delay: 0ms, 200ms;
		transition-timing-function: var(--ease), var(--ease-out);
	}

	menu :global(.theme-switcher) {
		transform: translateY(0rem);
		opacity: 1;

		transition-property: opacity, transform;
		transition-duration: 100ms;
		transition-timing-function: var(--ease) var(--ease);
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
			display: grid;
			grid-template-columns: var(--aside-width) auto;
			grid-template-rows: var(--header-height) auto;
			grid-template-areas:
				'menu menu'
				'nav main';
			gap: 0 var(--gap-width);
		}

		menu {
			top: 0;
			left: 0;
			right: 0;
			bottom: unset;
			grid-area: menu;
			width: auto;
		}

		menu :global(.button-menu-toggle) {
			display: none;
		}

		menu :global(.theme-switcher),
		menu :global(.theme-switcher.hidden) {
			opacity: 1;
			pointer-events: all;
		}

		.logo {
			display: initial;
		}

		nav {
			position: static;
			top: var(--header-height);
			right: unset;
			left: unset;
			grid-area: nav;
			pointer-events: initial;
			transition: none;
			transform: none;
			max-width: var(--aside-width);
			background: unset;
			padding-top: var(--top-gutter);
		}

		nav :global(> div) {
			position: sticky;
			top: calc(var(--header-height) + var(--top-gutter));
		}

		li:first-child {
			font-size: 1.25rem;
		}

		main {
			grid-area: main;
			margin-bottom: 6rem;
		}
	}
</style>
