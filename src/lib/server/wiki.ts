import { toHtml } from 'hast-util-to-html';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Code, Content, Heading } from 'mdast-util-from-markdown/lib';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { gfm } from 'micromark-extension-gfm';
import { get_file, get_file_edit_url, get_file_log } from './data';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { format } from 'date-fns';
import { WIKI_HOME } from '$env/static/private';

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

function create_section(heading: Heading) {
	const title = heading.children[0].type === 'text' ? heading.children[0].value : ''; // TODO: Should probably traverse the tree until we find another text node
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
	const mdast = fromMarkdown(raw_content, {
		extensions: [gfm()],
		mdastExtensions: [gfmFromMarkdown()]
	});

	return mdast.children.reduce<PageSection[]>(
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
