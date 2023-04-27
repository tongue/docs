import { browser } from '$app/environment';
import { readable, writable } from 'svelte/store';

function create_menu_expanded() {
	const { set, subscribe } = writable(false);

	const set_expanded = (expanded: boolean) => () => {
		if (browser) {
			document.body.classList.toggle('noscroll', expanded);
		}
		set(expanded);
	};

	return {
		subscribe,
		set: set_expanded
	};
}
export const menu_expanded = create_menu_expanded();

const check_if_large_screen = () => browser && matchMedia('(min-width: 55em)').matches;
export const is_large_screen = readable(check_if_large_screen(), (set) => {
	let resize_observer: ResizeObserver | null = null;

	if (browser) {
		resize_observer = new ResizeObserver(() => set(check_if_large_screen()));
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

	const initial_value = () => {
		if (!browser) return 'light';
		const persisted_theme = localStorage.getItem(STORAGE_KEY);
		if (persisted_theme && is_theme(persisted_theme)) return persisted_theme;
		return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};

	const { subscribe, set } = writable<Theme>(initial_value());

	const set_theme = (theme: Theme) => {
		set(theme);
		document.body.classList.toggle('light', theme === 'light');
		document.body.classList.toggle('dark', theme === 'dark');
		localStorage.setItem(STORAGE_KEY, theme);
	};

	return {
		subscribe,
		set: set_theme
	};
}
export const theme = create_theme();
