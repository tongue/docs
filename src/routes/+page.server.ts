import { get_page } from '$lib/server/wiki';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { files } = await parent();

	return get_page(files, 'home');
}) satisfies PageServerLoad;
