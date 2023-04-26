import { get_home } from '$lib/server/wiki';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { files } = await parent();

	return get_home(files);
}) satisfies PageServerLoad;
