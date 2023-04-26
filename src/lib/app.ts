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
