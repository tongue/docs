<script lang="ts">
	import { active_section } from '$lib/actions/active-section';
	import NavigationList from '$lib/components/navigation-list.svelte';
	import '$lib/styles/code.css';

	export let data;
	const { title, sections, modified, edit, author } = data.page;

	let active: string | null = null;

	const on_active = (event: CustomEvent<string>) => {
		active = event.detail;
	};
</script>

<svelte:head>
	<title>{title} | Alster Docs</title>
</svelte:head>
<article use:active_section on:activesection={on_active}>
	<div class="content">
		<header>
			<h1 id="top"><a href="#top">{title}</a></h1>
			<div>
				<ul>
					<li>Edited <time datetime={modified.value}>{modified.display}</time></li>
					<li>{author}</li>
				</ul>
				<a class="edit" href={edit}>Edit page</a>
			</div>
		</header>
		{#each sections as section}
			<section id={section.slug}>
				{#if section.title && section.slug}
					<h2 id={section.slug}><a href={`#${section.slug}`}>{section.title}</a></h2>
				{/if}
				{@html section.content}
			</section>
		{/each}
	</div>
	{#if sections.length > 1}
		<aside>
			<nav>
				<h2>In this article</h2>
				<NavigationList tag="ol">
					{#each sections as section}
						{#if section.title && section.slug}
							<li>
								<a
									href={`#${section.slug}`}
									aria-current={active === section.slug ? 'location' : undefined}>{section.title}</a
								>
							</li>
						{/if}
					{/each}
				</NavigationList>
			</nav>
		</aside>
	{/if}
</article>

<style>
	header {
		display: flex;
		flex-direction: column;
		container-type: inline-size;
	}

	header div {
		margin-top: 2rem;
		padding-top: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 4px solid var(--theme-stroke);
		color: var(--theme-body);
	}

	header ul {
		display: flex;
		align-items: baseline;
		padding: 0;
		margin: 0;
		list-style: none;
		font-size: 0.875rem;
		flex-direction: column;
	}

	header li:not(:first-child) {
		font-size: 0.75rem;
	}

	@container (min-width: 32em) {
		header ul {
			flex-direction: row;
		}

		header li:not(:first-child) {
			font-size: 0.875rem;
		}

		header li:not(:first-child)::before {
			content: '•';
			margin: 0 0.5ch;
		}
	}

	.edit {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--theme-fg);
		text-decoration: none;
		font-size: 0.75rem;
	}

	.edit::before {
		--icon-dark: url(/icons/edit_inverted.svg);
		--icon-light: url(/icons/edit.svg);
		--icon: var(--icon-light);

		content: '';
		display: inline-block;
		width: 1rem;
		height: 1rem;
		background-image: var(--icon);
	}

	@media (prefers-color-scheme: dark) {
		.edit::before {
			--icon: var(--icon-dark);
		}
	}

	:global(.dark) .edit::before {
		--icon: var(--icon-dark);
	}

	:global(.light) .edit::before {
		--icon: var(--icon-light);
	}

	aside {
		display: none;
	}

	@media (min-width: 73rem) {
		aside {
			display: block;
		}

		article {
			position: relative;
			display: grid;
			gap: 0 var(--gap-width);
			grid-template-columns: auto var(--aside-width);
		}
	}

	nav {
		position: sticky;
		top: calc(var(--header-height) + var(--top-gutter));
	}

	nav > h2 {
		font-size: 1rem;
		margin-bottom: 1.5rem;
	}
</style>
