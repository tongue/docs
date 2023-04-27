<script>
	let clazz = '';
	export { clazz as class };
	export let open = false;
</script>

<button on:click class={clazz}>
	<span class="block-a" class:on_a={open} class:off_a={!open} />

	<span class="block-b" class:on_b={open} class:off_b={!open} />
</button>

<style>
	button {
		all: unset;
		display: flex;
		align-items: end;
		--a-speed: 300ms;
		--a-speed-off: 320ms;
		--a-ease-on: var(--ease-in);
		--a-ease-off: var(--ease-in);

		--block-size: 0.75em;
		--block-size-double: calc(var(--block-size) * 2);

		width: 1.5em;
		height: 1.5em;
	}

	span {
		display: block;
		width: var(--block-size);
		background: var(--theme-fg);
	}

	.block-a {
		height: var(--block-size);
	}

	.block-b {
		height: var(--block-size-double);
	}

	.on_a {
		animation: toggle_on_a var(--a-speed) var(--a-ease-on) forwards;
	}

	.off_a {
		animation: toggle_off_a var(--a-speed-off) var(--a-ease-off) forwards;
	}

	.on_b {
		animation: toggle_on_b var(--a-speed) var(--a-ease-on) forwards;
	}

	.off_b {
		animation: toggle_off_b var(--a-speed-off) var(--a-ease-off) forwards;
	}

	@keyframes toggle_on_a {
		0% {
			transform: rotate(22deg);
			height: var(--block-size);
		}
		20% {
			height: var(--block-size);
			transform: rotate(45deg) translate(0, 0) scaleX(1);
		}
		50% {
			height: var(--block-size-double);
			transform: rotate(45deg) translate(30%, -18%) scaleX(1);
		}
		100% {
			height: var(--block-size-double);
			transform: rotate(45deg) translate(30%, -18%) scaleX(0.35);
		}
	}

	@keyframes toggle_off_a {
		0% {
			height: var(--block-size-double);
			transform: rotate(45deg) translate(30%, -18%) scaleX(0.35);
		}
		60% {
			height: var(--block-size-double);
			transform: rotate(45deg) translate(30%, -18%) scaleX(0.35);
		}
		80% {
			height: var(--block-size);
			transform: rotate(45deg) translate(0, 0) scaleX(1);
		}
		100% {
			transform: rotate(22deg);
			height: var(--block-size);
		}
	}

	@keyframes toggle_on_b {
		0% {
			transform: rotate(-22deg);
		}
		20% {
			transform: rotate(-45deg) translate(0, 0) scaleX(1);
		}
		50% {
			transform: rotate(-45deg) translate(-30%, -18%) scaleX(1);
		}
		100% {
			transform: rotate(-45deg) translate(-30%, -18%) scaleX(0.35);
		}
	}

	@keyframes toggle_off_b {
		100% {
			transform: rotate(-22deg);
		}
		80% {
			transform: rotate(-45deg) translate(0, 0) scaleX(1);
		}
		60% {
			transform: rotate(-45deg) translate(-30%, -18%) scaleX(0.35);
		}
		0% {
			transform: rotate(-45deg) translate(-30%, -18%) scaleX(0.35);
		}
	}
</style>
