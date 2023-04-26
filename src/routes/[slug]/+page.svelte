<script lang="ts">
	import Page from "$lib/components/page.svelte";
	import '$lib/styles/code.css';

	export let data;
	const { title, slug, sections, modified, edit, author } = data;
</script>

<Page {title} {slug} {sections} {modified} {edit} {author} />
