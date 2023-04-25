<script lang="ts">
	import { active_section } from '$lib/actions/active-section';
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
<article use:active_section on:activesection={on_active} class:toc={sections.length > 1}>
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
				<h2>Table of contents</h2>
				<ol>
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
				</ol>
			</nav>
		</aside>
	{/if}
</article>

<style>
	aside {
		display: none;
	}

	a[aria-current='location'] {
		font-weight: bold;
	}

	@media (min-width: 73rem) {
		aside {
			display: block;
		}

		article.toc {
			position: relative;
			display: grid;
			gap: 0 var(--gap-width);
			grid-template-columns: auto var(--aside-width);
		}
	}

	nav {
		position: sticky;
		top: var(--header-height);
	}
</style>
