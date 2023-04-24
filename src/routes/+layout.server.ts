import type { LayoutServerLoad } from './$types';
import { sync } from '$lib/server/data';
import { get_navigation } from '$lib/server/wiki';

export const load = (async () => {
	const files = await sync();

	return {
		navigation_items: get_navigation(files),
		files
	};
}) satisfies LayoutServerLoad;
