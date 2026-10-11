(function () {
	const form = document.querySelector('[data-form]');
	if (!form) return;

	const variant = form.dataset.variant;
	const status = form.querySelector('[data-form-status]');
	const submitBtn = form.querySelector('[type="submit"]');
	const paymentSection = form.querySelector('[data-payment-section]');
	const successPayment = form.querySelector('[data-success-payment]');
	const successConfirmation = form.querySelector('[data-success-confirmation]');

	const config = window.FORM_CONFIG;
	const emailjsConfigured = config
		&& config.emailjs.publicKey && !config.emailjs.publicKey.startsWith('EMAILJS_')
		&& config.emailjs.serviceId && !config.emailjs.serviceId.startsWith('EMAILJS_')
		&& config.emailjs.templates[variant] && !config.emailjs.templates[variant].startsWith('EMAILJS_');

	const squareUrl = config && config.square[variant];
	const squareConfigured = squareUrl && !squareUrl.startsWith('SQUARE_');
	const price = config && config.pricing && config.pricing[variant];

	if (price) form.querySelectorAll('[data-pay-price]').forEach((el) => { el.textContent = price; });

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

	// Form data is kept in localStorage while the customer is on Square's
	// checkout page, so it survives the redirect even when a wallet app (Apple
	// Pay, Cash App, etc.) returns them in a new tab. It is removed after a
	// successful submission and expires after 24 hours so personal details
	// don't linger on shared computers.
	const pendingKey = 'pendingSubmission:' + variant;
	const paymentKey = 'squarePayment:' + variant;
	const maxAgeMs = 24 * 60 * 60 * 1000;

	const readStored = (key) => {
		try {
			const stored = JSON.parse(localStorage.getItem(key));
			if (!stored || Date.now() - stored.savedAt > maxAgeMs) {
				localStorage.removeItem(key);
				return null;
			}
			return stored.value;
		} catch (err) { return null; }
	};
	const writeStored = (key, value) => {
		try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value: value })); return true; } catch (err) { return false; }
	};
	const clearStored = () => {
		try { localStorage.removeItem(pendingKey); localStorage.removeItem(paymentKey); } catch (err) { /* ignore */ }
	};

	const choiceInput = (value) => form.querySelector('input[name="paymentChoice"][value="' + value + '"]');
	const payNowSelected = () => { const now = choiceInput('now'); return !!(now && now.checked); };

	const collectFields = () => {
		const data = {};
		new FormData(form).forEach((value, key) => {
			data[key] = data[key] ? data[key] + ', ' + value : value;
		});
		return data;
	};

	const restoreFields = (data) => {
		Object.keys(data).forEach((key) => {
			form.querySelectorAll('[name="' + CSS.escape(key) + '"]').forEach((field) => {
				if (field.type === 'radio' || field.type === 'checkbox') field.checked = field.value === data[key];
				else field.value = data[key];
			});
		});
	};

	// Square appends orderId/transactionId to the redirect URL after checkout.
	// This is reported by the browser, so staff should confirm it in Square.
	const params = new URLSearchParams(window.location.search);
	let payment = null;
	if (params.get('orderId') || params.get('transactionId')) {
		const orderId = params.get('orderId') || params.get('transactionId');
		const transactionId = params.get('transactionId') || orderId;
		payment = {
			orderId: orderId,
			link: config.square.transactionUrlBase ? config.square.transactionUrlBase + encodeURIComponent(transactionId) : ''
		};
		writeStored(paymentKey, payment);
		// Strip the parameters so a page reload doesn't look like a new payment.
		history.replaceState(null, '', window.location.pathname);
	} else {
		payment = readStored(paymentKey);
	}

	const submitLabel = submitBtn ? submitBtn.textContent : 'Submit';
	const updateSubmitLabel = () => {
		if (!submitBtn || submitBtn.disabled) return;
		submitBtn.textContent = payNowSelected() && !payment ? 'Continue to secure payment' : submitLabel;
	};

	const setBusy = (text) => {
		if (!submitBtn) return;
		submitBtn.disabled = true;
		submitBtn.textContent = text;
	};

	const clearBusy = () => {
		if (!submitBtn) return;
		submitBtn.disabled = false;
		updateSubmitLabel();
	};

	// Optional receipt to the customer. Only non-sensitive details are included,
	// since a mistyped address would send it to a stranger. A failure here is
	// logged but not shown, because the submission itself already went through.
	// Returns whether a confirmation was attempted.
	const sendConfirmation = (fields) => {
		const templateId = config.emailjs.confirmationTemplate;
		if (!templateId || templateId.startsWith('EMAILJS_') || !fields.email) return false;

		emailjs.send(config.emailjs.serviceId, templateId, {
			email: fields.email,
			firstName: fields.firstName,
			lastName: fields.lastName,
			formType: variant === 'divorceWith' ? 'Divorce with minor children' : 'Divorce without minor children',
			paymentStatus: payment
				? 'Paid online. Square will email your receipt separately.'
				: "Not yet paid. We'll send you a secure payment link after we review your information."
		}).catch((err) => console.error('Confirmation email failed:', err));
		return true;
	};

	const send = async (fields) => {
		hideStatus();
		setBusy('Sending…');

		const templateParams = Object.assign({}, fields, {
			formType: variant === 'divorceWith' ? 'Divorce with minor children' : 'Divorce without minor children'
		}, payment
			? {
				paymentStatus: 'PAID online via Square (confirm in Square before filing)',
				squareOrderId: payment.orderId,
				squareLink: payment.link || ''
			}
			: {
				paymentStatus: 'Not paid (customer chose to pay later)',
				squareOrderId: '',
				squareLink: ''
			});
		delete templateParams.paymentChoice;

		try {
			await emailjs.send(config.emailjs.serviceId, config.emailjs.templates[variant], templateParams);
			clearStored();
			if (sendConfirmation(fields) && successConfirmation) {
				successConfirmation.textContent = 'A confirmation email is on its way to ' + fields.email
					+ ". If you don't see it within a few minutes, please check your spam or junk folder"
					+ ' and mark it "Not spam" so our future emails reach your inbox.';
				successConfirmation.hidden = false;
			}
			if (successPayment) {
				successPayment.textContent = payment
					? 'Your payment was received. Square will email your receipt.'
					: "You chose to pay later. We'll send you a secure payment link once we've reviewed your information.";
			}
			form.dataset.submitted = 'true';
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} catch (err) {
			console.error('Form submission failed:', err);
			showStatus('error', 'Something went wrong while sending your submission. Please try again, or call (580) 656-2669.');
			clearBusy();
		}
	};

	// Restore anything saved before the Square redirect (or if the customer
	// came back from checkout without paying).
	const pending = readStored(pendingKey);
	if (pending) restoreFields(pending);

	if (!squareConfigured || payment) {
		// Hidden radios are still validated, so pick the option that applies.
		const choice = choiceInput(payment ? 'now' : 'later');
		if (choice) choice.checked = true;
		if (paymentSection) paymentSection.hidden = true;
	}

	if (payment) {
		if (pending) {
			send(collectFields());
		} else {
			showStatus('info', 'Your payment was received. Please complete the form below and submit it; it will be marked as paid.');
		}
	}

	updateSubmitLabel();
	form.addEventListener('change', updateSubmitLabel);

	// Pressing Back from Square can show a frozen snapshot of this page with
	// the button still on "Redirecting to Square…"; make it usable again.
	window.addEventListener('pageshow', (event) => {
		if (event.persisted && form.dataset.submitted !== 'true') clearBusy();
	});

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		hideStatus();
		if (!form.reportValidity()) return;

		const fields = collectFields();

		if (payNowSelected() && !payment) {
			if (!writeStored(pendingKey, fields)) {
				showStatus('error', 'Your browser could not save the form before payment. Please choose "Pay later", or call (580) 656-2669.');
				return;
			}
			setBusy('Redirecting to Square…');
			window.location.href = squareUrl;
			return;
		}

		send(fields);
	});
})();
