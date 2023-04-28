<script lang="ts">
	import { overflow_ratio } from '$lib/actions/overflow_ratio';

	export let tag: 'ul' | 'ol' = 'ul';

	let start_ratio = 0;
	let end_ratio = 0;

	function handle_ratios(event: CustomEvent<number>) {
		if (event.type === 'startoverflowratio') {
			start_ratio = event.detail;
		} else if (event.type === 'endoverflowratio') {
			end_ratio = event.detail;
		}
	}
</script>

<div style="--start-ratio: {start_ratio}; --end-ratio: {end_ratio}">
	<svelte:element
		this={tag}
		use:overflow_ratio
		on:startoverflowratio={handle_ratios}
		on:endoverflowratio={handle_ratios}
	>
		<slot />
	</svelte:element>
</div>

<style>
	div {
		position: relative;
		overflow: hidden;
	}

	div::before,
	div::after {
		position: absolute;
		content: '';
		display: block;
		height: 1.5rem;
		left: 0;
		right: 0;
		z-index: 10;
	}

	div::before {
		top: 0;
		background: linear-gradient(to bottom, var(--theme-bg) 0%, transparent 100%);
		transform: translateY(calc((1 - var(--start-ratio)) * -100%));
	}

	div::after {
		bottom: 0;
		background: linear-gradient(to top, var(--theme-bg) 0%, transparent 100%);
		transform: translateY(calc((1 - var(--end-ratio)) * 100%));
	}

	ul,
	ol {
		display: flex;
		flex-direction: column;
		padding: 0;
		margin: 0;
		list-style: none;
		font-size: 1rem;
		overflow: auto;
		max-height: calc(100vh - (2 * var(--header-height)));
	}

	ul {
		padding-top: 2rem;
	}

	ul :global(a),
	ol :global(a) {
		position: relative;
		display: inline-block;
		padding: 1rem 1.5rem;
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
		background: var(--theme-panel);
	}

	ul :global(a[aria-current='page']::before),
	ol :global(a[aria-current='location']::before) {
		background: var(--theme-accent);
	}

	@media (min-width: 55em) {
		ul,
		ol {
			font-size: 0.875rem;
		}

		ul {
			padding-top: 0;
		}

		ul :global(a),
		ol :global(a) {
			padding: 0.5rem 1.5rem;
		}
	}
</style>
