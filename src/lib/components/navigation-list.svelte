<script lang="ts">
	export let tag: 'ul' | 'ol' = 'ul';
</script>

<svelte:element this={tag}>
	<slot />
</svelte:element>

<style>
	ul,
	ol{
		display: flex;
		flex-direction: column;
		padding: 0;
		margin: 0;
		list-style: none;
		font-size: 0.875rem;
	}

	ul :global(> li),
	ol :global(> li) {
		position: relative;
		padding-left: 1.5rem;
	}

	ul :global(> li > a),
	ol :global(> li > a) {
		display: inline-block;
		padding: 0.5rem 0;
		color: var(--theme-fg);

		text-decoration: none;
	}

	ul :global(> li > a) {
		font-weight: 500;
	}

	ol :global(> li > a) {
		font-weight: 400;
	}

	ul :global(> li > a[aria-current='page']),
	ul :global(> li > a[aria-current='location']) {
		font-weight: 700;
	}

	ol :global(> li > a[aria-current='page']),
	ol :global(> li > a[aria-current='location']) {
		font-weight: 500;
	}

	ul :global(> li > a::before),
	ol :global(> li > a::before) {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		content: '';
		width: 0.25rem;
	}

	ol :global(> li > a::before) {
		background: var(--theme-border);
	}

	ul :global(> li > a[aria-current='page']::before),
	ol :global(> li > a[aria-current='location']::before) {
		background: var(--theme-accent);
	}
</style>
