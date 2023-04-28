import {
	decode_name,
	get_file,
	get_file_edit_url,
	get_name_from_path,
	get_all_markdown_paths,
	to_slug
} from '$lib/server/data';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { sections } from '$lib/server/markdown';
import { format } from 'date-fns';

async function get_page(path: string) {
	const name = get_name_from_path(path);
	if (!name) throw error(503, `Could not extract name from path: ${path}`);

	return {
		title: decode_name(name),
		author: 'unknown',
		modified: { display: format(new Date(), 'MMM d yyyy'), value: new Date().toISOString() },
		sections: sections(get_file(path)),
		edit: get_file_edit_url(name)
	};
}

export const load = (async ({ params }) => {
	for (const path of get_all_markdown_paths()) {
		if (to_slug(get_name_from_path(path)) === params.slug) {
			return {
				page: await get_page(path)
			}
		}
	}

	throw error(404);
}) satisfies PageServerLoad;
