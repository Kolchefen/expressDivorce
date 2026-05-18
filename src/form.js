(function () {
	const form = document.querySelector('[data-form]');
	if (!form) return;

	const variant = form.dataset.variant;
	const status = form.querySelector('[data-form-status]');
	const submitBtn = form.querySelector('[type="submit"]');
	const payBtn = form.querySelector('[data-pay-btn]');
	const priceLabel = form.querySelector('[data-pay-price]');

	const config = window.FORM_CONFIG;
	const emailjsConfigured = config
		&& config.emailjs.publicKey && !config.emailjs.publicKey.startsWith('EMAILJS_')
		&& config.emailjs.serviceId && !config.emailjs.serviceId.startsWith('EMAILJS_')
		&& config.emailjs.templates[variant] && !config.emailjs.templates[variant].startsWith('EMAILJS_');

	const squareUrl = config && config.square[variant];
	const squareConfigured = squareUrl && !squareUrl.startsWith('SQUARE_');
	const price = config && config.pricing && config.pricing[variant];

	if (priceLabel && price) priceLabel.textContent = price;

	if (payBtn) {
		if (squareConfigured) {
			payBtn.href = squareUrl;
			payBtn.hidden = false;
		} else {
			payBtn.hidden = true;
		}
	}

	const showStatus = (kind, message) => {
		if (!status) return;
		status.className = 'form-status form-status--' + kind;
		status.textContent = message;
		status.hidden = false;
	};

	const hideStatus = () => { if (status) status.hidden = true; };

	if (!emailjsConfigured) {
		showStatus('info', 'This form is not yet configured for live submissions. Please call (580) 656-2669 or email lesliedawngolden@yahoo.com to start your filing.');
		if (submitBtn) submitBtn.disabled = true;
		return;
	}

	if (typeof emailjs !== 'undefined') {
		emailjs.init({ publicKey: config.emailjs.publicKey });
	}

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		hideStatus();
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.dataset.originalText = submitBtn.textContent;
			submitBtn.textContent = 'Sending…';
		}

		try {
			await emailjs.sendForm(
				config.emailjs.serviceId,
				config.emailjs.templates[variant],
				form
			);
			form.dataset.submitted = 'true';
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} catch (err) {
			console.error('Form submission failed:', err);
			showStatus('error', 'Something went wrong while sending your submission. Please try again, or call (580) 656-2669.');
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
			}
		}
	});
})();
