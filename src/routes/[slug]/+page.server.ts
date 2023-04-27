import {
	decode_name,
	get_file,
	get_file_edit_url,
	get_file_log,
	get_name_from_path,
	get_all_markdown_paths,
	to_slug
} from '$lib/server/data';
import format from 'date-fns/format';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { sections } from '$lib/server/markdown';

async function get_page(path: string) {
	const git_log = await get_file_log(path);
	const name = get_name_from_path(path);
	if (!name) throw error(503, `Could not extract name from path: ${path}`);

	return {
		title: decode_name(name),
		author: git_log?.latest?.author_name ?? 'unknown',
		modified: git_log?.latest?.date
			? { display: format(new Date(git_log.latest.date), 'MMM d yyyy'), value: git_log.latest.date }
			: { display: 'unknown', value: '' },
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
