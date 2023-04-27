import { browser } from '$app/environment';
import { readable, writable } from 'svelte/store';

function create_menu_expanded() {
	const { set, subscribe, update } = writable(false);

	function make_inert(value: boolean) {
		document.body.classList.toggle('noscroll', value);
		const main = document.querySelector('main');
		if (main) main.inert = value;
	}

	function set_expanded(expanded: boolean) {
		return () => {
			if (!browser) return;
			make_inert(expanded);
			set(expanded);
		};
	}

	function toggle() {
		update((expanded) => {
			make_inert(!expanded);
			return !expanded;
		});
	}

	return {
		subscribe,
		set: set_expanded,
		toggle
	};
}
export const menu_expanded = create_menu_expanded();

const matches_large_screen_mq = () => browser && matchMedia('(min-width: 55em)').matches;
export const is_large_screen = readable(matches_large_screen_mq(), (set) => {
	let resize_observer: ResizeObserver | null = null;

	function on_resize() {
		set(matches_large_screen_mq());
	}

	if (browser) {
		resize_observer = new ResizeObserver(on_resize);
		resize_observer.observe(document.body);
	}

	return () => {
		if (resize_observer) {
			resize_observer.disconnect();
		}
	};
});

type Theme = 'dark' | 'light';
function create_theme() {
	const STORAGE_KEY = 'docs-theme';

	const is_theme = (value: string): value is Theme => value === 'dark' || value === 'light';

	function get_preferred_theme() {
		if (!browser) return 'light';
		const persisted_theme = localStorage.getItem(STORAGE_KEY);
		if (persisted_theme && is_theme(persisted_theme)) return persisted_theme;
		return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	const { subscribe, set } = writable<Theme>(get_preferred_theme());

	function set_theme(theme: Theme) {
		if (!browser) return;
		set(theme);
		document.body.classList.toggle('light', theme === 'light');
		document.body.classList.toggle('dark', theme === 'dark');
		localStorage.setItem(STORAGE_KEY, theme);
	}

	set_theme(get_preferred_theme());

	return {
		subscribe,
		set: set_theme
	};
}
export const theme = create_theme();
