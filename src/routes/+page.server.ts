import { get_all_markdown_paths, get_file } from '$lib/server/data';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { html_block, mdast_from_markdown } from '$lib/server/markdown';
import { WIKI_HOME } from '$env/static/private';

export const load = (async () => {
	const path = get_all_markdown_paths().find((path) => path.endsWith(`${WIKI_HOME}.md`));
	if (!path) throw error(404, 'Found no Home page');

	const tree = mdast_from_markdown(get_file(path));

	return tree.children.reduce<{ body: string; cards: string[] }>(
		(acc, child) => {
			if (child.type === 'heading' && child.depth === 3) {
				acc.cards.push(html_block(child));
				return acc;
			}

			if (acc.cards.length === 0) {
				acc.body += html_block(child);
				return acc;
			}

			acc.cards[acc.cards.length - 1] += html_block(child);
			return acc;
		},
		{ body: '', cards: [] }
	);
}) satisfies PageServerLoad;
