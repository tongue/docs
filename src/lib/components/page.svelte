<script lang="ts">
	import { active_section } from '$lib/actions/active-section';
	import NavigationList from './navigation-list.svelte';
	import PageHeader from './page-header.svelte';

	export let title: string;
	export let slug: string;
	export let author: string;
	export let edit: string;
	export let modified: { value: string; display: string };
	export let sections: { title: string | null; slug: string | null; content: string }[];

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
		<PageHeader {slug} {author} {modified} {edit}>{title}</PageHeader>
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
