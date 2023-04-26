<script lang="ts">
	export let data;
	const { body, cards } = data;
</script>

<svelte:head>
	<title>Alster Docs</title>
</svelte:head>
<article>
	{@html body}

	{#if cards.length}
		<ul>
			{#each cards as card}
				<li>
					<article class="card">
						{@html card}
					</article>
				</li>
			{/each}
		</ul>
	{/if}
</article>

<style>
	article:not(.card) {
		max-width: 47rem;
	}

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1rem;

		margin: 2rem 0;
		padding: 0;
		list-style: none;
	}

	.card {
		background-color: var(--theme-card);
		border-radius: 0.25rem;
		padding: 1.5rem;
	}

	.card :global(h3) {
		font-size: 1.125rem;
	}

	.card :global(h3 + p) {
		margin-top: 1rem;
	}
</style>
