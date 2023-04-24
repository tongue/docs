<script lang="ts">
	import { page } from '$app/stores';
	import 'prismjs/themes/prism.css';

	export let data;
</script>

<div>
	<nav>
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
