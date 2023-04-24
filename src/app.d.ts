// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:activesection'?: (event: CustomEvent<string>) => void;
		}
		interface DOMAttributes<T> {
			'on:activesection'?: (event: CustomEvent<string>) => void;
		}
	}
}

export { };
