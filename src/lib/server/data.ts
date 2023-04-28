import { glob } from 'glob';
import { mkdirp } from 'mkdirp';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import simpleGit, { GitError } from 'simple-git';
import slugify from 'slugify';
import { GITHUB_PROJECT, DATA_DIR } from '$env/static/private';

export const REPOSITORY = resolve(DATA_DIR, `${GITHUB_PROJECT.split('/')[1]}.wiki`);

export const get_name_from_path = (path: string) => path.split('/').pop()?.replace('.md', '');

export const decode_name = (slug: string) => slug.split('-').join(' ');

export const get_all_markdown_paths = () =>
	glob.sync(`${REPOSITORY}**/*.md`, { ignore: '.git/**' });

export const get_file = (path: string) => readFileSync(path, 'utf-8');

export const get_file_log = async (path: string) => {
	try {
		const log = await simpleGit(REPOSITORY).log({ file: path });
		return log;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const to_slug = (value?: string | null) =>
	slugify(value ?? 'unknown', { strict: true, lower: true });

export const get_file_edit_url = (name: string) =>
	`https://github.com/${GITHUB_PROJECT}/wiki/${encodeURIComponent(name)}/_edit`;

// Get the latest version of the wiki
export async function sync() {
	const v = await simpleGit().version();
	console.log('version', v);
	if (existsSync(REPOSITORY)) {
		try {
			const g = simpleGit(REPOSITORY, { timeout: { block: 2000 } });
			await g.remote(['update']);
			const gst = await g.status();
			if (gst.behind > 0) {
				await g.pull('origin', gst.current ?? 'master', ['--rebase']);
				console.log('wiki data: updated to latest changes.');
			} else {
				console.log('wiki data: is already all up to date.');
			}
		} catch (error: unknown) {
			if (error instanceof GitError) {
				console.error(error.message);
				console.info('wiki data: continuing with possibly stale data.');
			}
		}
	} else {
		console.log('wiki data: no local repository found, cloning.');
		await mkdirp(DATA_DIR);
		try {
			await simpleGit(DATA_DIR).clone(`https://github.com/${GITHUB_PROJECT}.wiki.git`);
			console.log('wiki data: cloned repository.');
		} catch (error) {
			if (error instanceof GitError) {
				console.error(error.message);
			}
		}
	}
}
