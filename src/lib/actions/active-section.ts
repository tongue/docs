export function active_section(node: HTMLElement) {
	let last_active: string | null = null;
	const sections = new Map<string, { position: number; ratio: number }>();

	const on_intersection = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			const values = sections.get(entry.target.id);
			if (values) {
				values.ratio = entry.intersectionRatio;
			}
		});

		check_active();
	};

	const check_active = () => {
		const active = [...sections.entries()].sort((a, b) => b[1].ratio - a[1].ratio).shift();

		if (active && last_active !== active[0]) {
			const new_active = active[1].ratio > 0 ? active[0] : null;
			last_active = new_active;
			node.dispatchEvent(
				new CustomEvent('activesection', {
					detail: new_active
				})
			);
		}
	};

	const observer = new IntersectionObserver(on_intersection, {
		threshold: Array(101)
			.fill(0)
			.map((_, i) => i / 100)
	});

	node.querySelectorAll('section').forEach((child, index) => {
		if (child.id.length > 0) {
			observer.observe(child);
			sections.set(child.id, { position: index, ratio: 0 });
		}
	});

	return {
		destroy() {
			observer?.disconnect();
		}
	};
}
