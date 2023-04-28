import { glob } from 'glob';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import slugify from 'slugify';
import { GITHUB_PROJECT } from '$env/static/private';

export const REPOSITORY = resolve('markdown');

export const get_name_from_path = (path: string) => path.split('/').pop()?.replace('.md', '');

export const decode_name = (slug: string) => slug.split('-').join(' ');

export const get_all_markdown_paths = () =>
	glob.sync(`${REPOSITORY}**/*.md`, { ignore: '.git/**' });

export const get_file = (path: string) => readFileSync(path, 'utf-8');

export const to_slug = (value?: string | null) =>
	slugify(value ?? 'unknown', { strict: true, lower: true });

export const get_file_edit_url = (name: string) =>
	`https://github.com/${GITHUB_PROJECT}/wiki/${encodeURIComponent(name)}/_edit`;
