import { toHtml } from 'hast-util-to-html';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Code, Content, Heading, PhrasingContent } from 'mdast-util-from-markdown/lib';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { gfm } from 'micromark-extension-gfm';
import { to_slug } from './data';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { GITHUB_PROJECT } from '$env/static/private';

export type PageSection = {
	title: string | null;
	slug: string | null;
	content: string;
};

function transform_wiki_links<T extends Content>(content: T): T {
	if (content.type === 'link') {
		if (content.url.startsWith(`https://github.com/${GITHUB_PROJECT}`)) {
			const slug = content.url.split('/').pop()?.replace('.md', '');
			if (slug) {
				content.url = `/articles/${to_slug(decodeURIComponent(slug))}`;
			}
		}
	}
	if ('children' in content) {
		return { ...content, children: content.children.map(transform_wiki_links) };
	}
	return content;
}

export function mdast_from_markdown(raw_content: string) {
	const mdast = fromMarkdown(raw_content, {
		extensions: [gfm()],
		mdastExtensions: [gfmFromMarkdown()]
	});
	mdast.children = mdast.children.map(transform_wiki_links);
	return mdast;
}

function get_text(content: PhrasingContent[]): string {
	return content.reduce((value, node) => {
		if (node.type === 'text') {
			return value + node.value;
		}
		if ('children' in node) {
			return value + get_text(node.children);
		}
		return value;
	}, '');
}

function section(heading: Heading) {
	const title = get_text(heading.children);
	return { title, slug: encodeURI(title.replaceAll(' ', '-')), content: '' };
}

function code_block(code: Code) {
	loadLanguages([code.lang ?? '']);
	return `<pre class="language-${code.lang ?? ''}"><code class="language-${code.lang ?? ''
		}">${prism.highlight(
			code.value,
			prism.languages[code.lang ?? ''],
			code.lang ?? ''
		)}</code></pre>`;
}

export function html_block(content: Content) {
	const hast = toHast(content);
	return hast ? toHtml(hast) : '';
}

export function sections(raw_content: string) {
	const tree = mdast_from_markdown(raw_content);

	return tree.children.reduce<PageSection[]>(
		(acc_sections, child) => {
			if (child.type === 'heading' && child.depth === 2) {
				acc_sections.push(section(child));
				return acc_sections;
			}

			const section_content = acc_sections[acc_sections.length - 1].content;
			// If the last block is a string, just concat the new html block
			// else add a new block
			const html = child.type === 'code' ? code_block(child) : html_block(child);
			acc_sections[acc_sections.length - 1].content = section_content + html;
			return acc_sections;
		},
		[{ slug: null, title: null, content: '' }]
	);
}
