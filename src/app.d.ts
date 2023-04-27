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
			'on:startoverflowratio'?: (event: CustomEvent<number>) => void;
			'on:endoverflowratio'?: (event: CustomEvent<number>) => void;
		}
		interface DOMAttributes<T> {
			'on:activesection'?: (event: CustomEvent<string>) => void;
			'on:startoverflowratio'?: (event: CustomEvent<number>) => void;
			'on:endoverflowratio'?: (event: CustomEvent<number>) => void;
		}
	}
}

export { };
