/* ---------------------------------------------------------------------------
 * Form configuration for the custom divorce intake forms.
 *
 * To go live, replace the four EMAILJS_* placeholders below with real values
 * from your https://www.emailjs.com/ dashboard and update the SQUARE_*
 * URLs with the payment links generated in your Square Dashboard.
 *
 * Setup steps:
 *   1. Create a free EmailJS account at https://www.emailjs.com/
 *   2. Add an Email Service (Gmail, Outlook, etc.) and copy the Service ID
 *   3. Create one Email Template using emailjs-templates/intake-email.html
 *      (it handles both form variants) and use its Template ID for both
 *      entries below. Fields are referenced as {{firstName}}, {{lastName}},
 *      etc., plus {{formType}}, {{paymentStatus}}, {{squareOrderId}} and
 *      {{squareLink}}.
 *   4. Copy the Public Key from Account → API Keys
 *   5. In Square Dashboard → Payment links, create a link for each standard
 *      fee ($159.95 without children, $259.95 with children). While creating
 *      each link, turn on "Redirect to a website after checkout" and enter
 *      the matching form page, e.g. https://yourdomain.com/divorceWith
 *      Square appends the order ID to that URL, which marks the submission
 *      as paid. Non-standard cases ($209.95 missing spouse, $309.95 with
 *      90-day waiver) are handled by choosing "Pay later" and emailing the
 *      customer a separate Square invoice once their submission is reviewed.
 *   6. Replace the placeholders below and commit. Submit will start working.
 *
 * While EmailJS placeholders remain, the form will display an informational
 * notice and refuse to submit so customers are not silently dropped. While
 * Square placeholders remain, the "Pay now" option is hidden.
 * ------------------------------------------------------------------------- */

window.FORM_CONFIG = {
	emailjs: {
		publicKey: 'BrlvoHXwkR-ByLDjv',
		serviceId: 'service_rdst5ne',
		templates: {
			divorceWith: 'template_mg3l11b',
			divorceWithOut: 'template_mg3l11b'
		},
		// Optional confirmation sent to the customer after a successful
		// submission (emailjs-templates/confirmation-email.html). Leave as the
		// placeholder or an empty string to skip it.
		confirmationTemplate: 'template_lz1t8um'
	},
	square: {
		// Payment link URLs used by the "Pay now" option. Leave as empty
		// strings to hide "Pay now" and only offer "Pay later".
		divorceWith: 'https://square.link/u/LXrbCoD1',
		divorceWithOut: 'https://square.link/u/s1cWRZ1V',
		// The Square transaction ID is appended to this to build the link in
		// the notification email. Confirm it after your first real payment by
		// opening the transaction in Square Dashboard and comparing the URL.
		transactionUrlBase: 'https://app.squareup.com/dashboard/sales/transactions/'
	},
	pricing: {
		// Displayed next to the "Pay now" option.
		divorceWith: '$259.95',
		divorceWithOut: '$159.95'
	}
};
