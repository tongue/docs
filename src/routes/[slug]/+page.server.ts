import { get_page } from '$lib/server/wiki';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, params }) => {
	const { files } = await parent();

	return get_page(files, params.slug);
}) satisfies PageServerLoad;
