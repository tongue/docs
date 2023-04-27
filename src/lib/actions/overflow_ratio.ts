export function overflow_ratio(node: HTMLElement) {
	const threshold = Array(101)
		.fill(0)
		.map((_, i) => i / 100);

	let last_start_value = 0;
	let last_end_value = 0;

	const on_intersection = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			const content_overflows = node.scrollHeight > node.offsetHeight;
			if (content_overflows) {
				if (entry.target === node.firstElementChild) {
					let start_value = 1 - entry.intersectionRatio;
					if (node.scrollTop > entry.target.getBoundingClientRect().height) {
						start_value = 1;
					}
					if (start_value === 0) {
						start_value = 0.0001;
					}
					if (start_value !== last_start_value) {
						last_start_value = start_value;
						dispatch('start', start_value);
					}
				} else if (entry.target === node.lastElementChild) {
					let end_value = 1 - entry.intersectionRatio;
					if (node.scrollTop + node.clientHeight === node.scrollHeight) {
						end_value = 0;
					}
					if (end_value === 0) {
						end_value = 0.0001;
					}
					if (end_value !== last_end_value) {
						last_end_value = end_value;
						dispatch('end', end_value);
					}
				}
			}
		});
	};

	const dispatch = (id: string, ratio: number) => {
		node.dispatchEvent(new CustomEvent(`${id}overflowratio`, { detail: ratio }));
	};

	const observer = new IntersectionObserver(on_intersection, {
		threshold,
		root: node
	});

	const first = node.firstElementChild;
	const last = node.lastElementChild;

	if (first && last && observer) {
		observer.observe(first);
		observer.observe(last);
	}

	return {
		destroy() {
			if (observer) observer.disconnect();
		}
	};
}
