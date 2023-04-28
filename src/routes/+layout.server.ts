import type { LayoutServerLoad } from './$types';
import {
	decode_name,
	get_name_from_path,
	get_all_markdown_paths,
	to_slug
} from '$lib/server/data';
import { WIKI_HOME } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load = (async () => {
	return {
		navigation_items: get_all_markdown_paths().reduce<{ title: string; slug: string }[]>(
			(navigation_items, path) => {
				const name = get_name_from_path(path);
				const title = decode_name(name ?? '');

				if (name && title) {
					if (name === WIKI_HOME) {
						navigation_items.unshift({ title, slug: '' });
					} else {
						navigation_items.push({ title, slug: to_slug(name) });
					}
				} else {
					throw error(503, 'Could not generate navigation item');
				}

				return navigation_items;
			},
			[]
		)
	};
}) satisfies LayoutServerLoad;
