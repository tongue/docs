<script lang="ts">
	export let tag: 'ul' | 'ol' = 'ul';
</script>

<svelte:element this={tag}>
	<slot />
</svelte:element>

<style>
	ul,
	ol {
		display: flex;
		flex-direction: column;
		padding: 0;
		margin: 0;
		list-style: none;
		font-size: 0.875rem;
	}

	ul :global(a),
	ol :global(a) {
		position: relative;
		display: inline-block;
		padding: 0.5rem 1.5rem;
		color: var(--theme-fg);
		text-decoration: none;
	}

	ul :global(a) {
		font-weight: 500;
		width: 100%;
	}

	ol :global(a) {
		font-weight: 400;
	}

	ul :global(a[aria-current='page']),
	ol :global(a[aria-current='location']) {
		background: linear-gradient(
			270deg,
			var(--theme-nav-gradient-start) -0.09%,
			var(--theme-nav-gradient-end) 100%
		);
	}

	ul :global(a[aria-current='page']) {
		font-weight: 700;
	}

	ol :global(a[aria-current='location']) {
		font-weight: 500;
	}

	ul :global(a::before),
	ol :global(a::before) {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		content: '';
		width: 0.25rem;
	}

	ol :global(a::before) {
		background: var(--theme-stroke);
	}

	ul :global(a[aria-current='page']::before),
	ol :global(a[aria-current='location']::before) {
		background: var(--theme-accent);
	}
</style>
