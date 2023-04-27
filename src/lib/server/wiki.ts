import { toHtml } from 'hast-util-to-html';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Code, Content, Heading, PhrasingContent } from 'mdast-util-from-markdown/lib';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { gfm } from 'micromark-extension-gfm';
import { get_file, get_file_edit_url, get_file_log, to_slug } from './data';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { format } from 'date-fns';
import { GITHUB_PROJECT, WIKI_HOME } from '$env/static/private';
import { get } from 'http';

export type PageSection = {
	title: string | null;
	slug: string | null;
	content: string;
};

export type PageMeta = {
	title: string;
	slug: string;
};

type Page = PageMeta & {
	sections: PageSection[];
	modified: { display: string; value: string };
	author: string;
	edit: string;
};

type HomePage = {
	body: string;
	cards: string[];
};

function transform_wiki_links<T extends Content>(content: T): T {
	if (content.type === 'link') {
		if (content.url.startsWith(`https://github.com/${GITHUB_PROJECT}`)) {
			const slug = content.url.split('/').pop()?.replace('.md', '');
			if (slug) {
				content.url = `/${to_slug(decodeURIComponent(slug))}`;
			}
		}
	}
	if ('children' in content) {
		return { ...content, children: content.children.map(transform_wiki_links) };
	}
	return content;
}

function get_tree_from_markdown(raw_content: string) {
	const mdast = fromMarkdown(raw_content, {
		extensions: [gfm()],
		mdastExtensions: [gfmFromMarkdown()]
	});
	mdast.children = mdast.children.map(transform_wiki_links);
	return mdast;
}

function get_text_content(content: PhrasingContent[]): string {
	return content.reduce((value, node) => {
		if (node.type === 'text') {
			return value + node.value;
		}
		if ('children' in node) {
			return value + get_text_content(node.children);
		}
		return value;
	}, '');
}

function create_section(heading: Heading) {
	const title = get_text_content(heading.children);
	return { title, slug: encodeURI(title.replaceAll(' ', '-')), content: '' };
}

function create_code_block(code: Code) {
	loadLanguages([code.lang ?? '']);
	return `<pre class="language-${code.lang ?? ''}"><code class="language-${code.lang ?? ''
		}">${prism.highlight(
			code.value,
			prism.languages[code.lang ?? ''],
			code.lang ?? ''
		)}</code></pre>`;
}

function create_html_block(content: Content) {
	const hast = toHast(content);
	return hast ? toHtml(hast) : '';
}

function create_sections(raw_content: string) {
	const tree = get_tree_from_markdown(raw_content);

	return tree.children.reduce<PageSection[]>(
		(acc_sections, child) => {
			if (child.type === 'heading' && child.depth === 2) {
				acc_sections.push(create_section(child));
				return acc_sections;
			}

			const section_content = acc_sections[acc_sections.length - 1].content;
			// If the last block is a string, just concat the new html block
			// else add a new block
			const html = child.type === 'code' ? create_code_block(child) : create_html_block(child);
			acc_sections[acc_sections.length - 1].content = section_content + html;
			return acc_sections;
		},
		[{ slug: null, title: null, content: '' }]
	);
}

const decode_filename = (slug: string) => slug.split('-').join(' ');

export function get_navigation(files: Map<string, string>): PageMeta[] {
	return [...files].reduce<PageMeta[]>((navigation_items, [slug, path]) => {
		const file = path.split('/').pop()?.replace('.md', '');
		const title = decode_filename(file ?? '');

		if (file && title) {
			if (file === WIKI_HOME) {
				navigation_items.unshift({ title, slug: '' });
			} else {
				navigation_items.push({ title, slug });
			}
		} else {
			console.warn(`could not generate a navigation item for file: ${path}`);
		}
		return navigation_items;
	}, []);
}

export async function get_page(files: Map<string, string>, slug: string): Promise<Page> {
	const path = files.get(slug);
	if (!path) throw new Error(`No file found for slug: ${slug}`);
	const filename = path.split('/').pop();
	if (!filename) throw new Error(`Could not extract filename: ${path}`);
	const name = filename.replace('.md', '');
	if (!name) throw new Error(`Could not extract name without suffix: ${filename}`);
	const git_log = await get_file_log(path);

	const title = decode_filename(name);
	const author = git_log?.latest?.author_name ?? 'unknown';
	const modified = git_log?.latest?.date
		? { display: format(new Date(git_log.latest.date), 'MMM d yyyy'), value: git_log.latest.date }
		: { display: 'unknown', value: '' };
	const sections: PageSection[] = create_sections(get_file(path));
	const edit = get_file_edit_url(name);

	return { title, slug, author, modified, sections, edit };
}

export async function get_home(files: Map<string, string>): Promise<HomePage> {
	const path = files.get('');
	if (!path) throw new Error('Found no home page');
	const filename = path.split('/').pop();
	if (!filename) throw new Error(`Could not extract filename: ${path}`);
	const name = filename.replace('.md', '');
	if (!name) throw new Error(`Could not extract name without suffix: ${filename}`);

	const tree = get_tree_from_markdown(get_file(path));

	return tree.children.reduce<{ body: string; cards: string[] }>(
		(acc, child) => {
			if (child.type === 'heading' && child.depth === 3) {
				acc.cards.push(create_html_block(child));
				return acc;
			}

			if (acc.cards.length === 0) {
				acc.body += create_html_block(child);
				return acc;
			}

			acc.cards[acc.cards.length - 1] += create_html_block(child);
			return acc;
		},
		{ body: '', cards: [] }
	);
}
