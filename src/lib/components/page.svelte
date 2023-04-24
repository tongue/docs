<script lang="ts">
	import { active_section } from '$lib/actions/active-section';

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
	<div>
		<header>
			<h1 id={slug}><a href={`#${slug}`}>{title}</a></h1>
			<div>
				<ul class="byline">
					<li>Edited <time datetime={modified.value}>{modified.display}</time></li>
					<li>{author}</li>
				</ul>
				<a href={edit}>Edit page</a>
			</div>
		</header>
		{#each sections as section}
			<section id={section.slug}>
				{#if section.title && section.slug}
					<header>
						<h2 id={section.slug}><a href={`#${section.slug}`}>{section.title}</a></h2>
					</header>
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
	article.toc {
		position: relative;
		display: grid;
		gap: 0 1em;
		grid-template-columns: 7fr 3fr;
	}

	header div {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	ul {
		display: flex;
		align-items: baseline;
		padding: 0;
		margin: 0;
		gap: 1ch;
		list-style: none;
	}

	ul li:not(:first-child)::before {
		content: '•';
		margin-right: 1ch;
	}

	nav {
		position: sticky;
		top: 0;
	}

	a[aria-current='location'] {
		font-weight: bold;
	}
</style>
