<script lang="ts">
	export let slug: string;
	export let edit: string;
	export let author: string;
	export let modified: { value: string; display: string };
</script>

<header>
	<h1 id={slug}><a href={`#${slug}`}><slot /></a></h1>
	<div>
		<ul>
			<li>Edited <time datetime={modified.value}>{modified.display}</time></li>
			<li>{author}</li>
		</ul>
		<a class="edit" href={edit}>Edit page</a>
	</div>
</header>

<style>
	header {
		display: flex;
		flex-direction: column;
		container-type: inline-size;
	}

	div {
		margin-top: 2rem;
		padding-top: 1.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--theme-border);
	}

	ul {
		display: flex;
		align-items: baseline;
		padding: 0;
		margin: 0;
		list-style: none;
		font-size: 0.875rem;
		flex-direction: column;
	}

	li:not(:first-child) {
		font-size: 0.75rem;
	}

	@container (min-width: 32em) {
		ul {
			flex-direction: row;
		}

		li:not(:first-child) {
			font-size: 0.875rem;
		}

		li:not(:first-child)::before {
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
</style>
