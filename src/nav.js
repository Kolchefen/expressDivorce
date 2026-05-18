(function () {
	const nav = document.querySelector('[data-nav]');
	if (!nav) return;

	const toggle = nav.querySelector('[data-nav-toggle]');
	const menu = nav.querySelector('[data-nav-menu]');
	if (!toggle || !menu) return;

	const setOpen = (open) => {
		nav.dataset.open = open ? 'true' : 'false';
		toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
	};

	setOpen(false);

	toggle.addEventListener('click', () => {
		setOpen(nav.dataset.open !== 'true');
	});

	menu.addEventListener('click', (event) => {
		if (event.target.matches('a')) setOpen(false);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && nav.dataset.open === 'true') setOpen(false);
	});

	const desktop = window.matchMedia('(min-width: 900px)');
	const sync = () => { if (desktop.matches) setOpen(false); };
	desktop.addEventListener('change', sync);
})();
