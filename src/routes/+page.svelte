<script lang="ts">
	import Page from "$lib/components/page.svelte";

	export let data;
	const { title, slug, sections, modified, edit, author } = data;
</script>

<Page {title} {slug} {sections} {modified} {edit} {author} />
