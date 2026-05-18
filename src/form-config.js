/* ---------------------------------------------------------------------------
 * Form configuration for the custom divorce intake forms.
 *
 * To go live, replace the four EMAILJS_* placeholders below with real values
 * from your https://www.emailjs.com/ dashboard and update the SQUARE_*
 * URLs with the Checkout Links generated in your Square Dashboard.
 *
 * Setup steps:
 *   1. Create a free EmailJS account at https://www.emailjs.com/
 *   2. Add an Email Service (Gmail, Outlook, etc.) and copy the Service ID
 *   3. Create two Email Templates (one per form variant). In each template
 *      reference the form fields as {{firstName}}, {{lastName}}, etc.
 *   4. Copy the Public Key from Account → API Keys
 *   5. In Square Dashboard, create Checkout Links for the standard fees
 *      ($159.95 without children, $259.95 with children) and paste their
 *      URLs below. Non-standard cases ($209.95 missing spouse, $309.95 with
 *      90-day waiver) are currently handled by emailing the customer a
 *      separate Square invoice once their submission is reviewed.
 *   6. Replace the placeholders below and commit. Submit will start working.
 *
 * While placeholders remain, the form will display an informational notice
 * and refuse to submit so customers are not silently dropped.
 * ------------------------------------------------------------------------- */

window.FORM_CONFIG = {
	emailjs: {
		publicKey: 'EMAILJS_PUBLIC_KEY',
		serviceId: 'EMAILJS_SERVICE_ID',
		templates: {
			divorceWith: 'EMAILJS_TEMPLATE_ID_WITH_CHILDREN',
			divorceWithOut: 'EMAILJS_TEMPLATE_ID_WITHOUT_CHILDREN'
		}
	},
	square: {
		// Optional "pay to expedite" Checkout Link URLs. Leave as empty strings
		// to hide the pay button after a successful submission.
		divorceWith: 'SQUARE_CHECKOUT_LINK_WITH_CHILDREN',
		divorceWithOut: 'SQUARE_CHECKOUT_LINK_WITHOUT_CHILDREN'
	},
	pricing: {
		// Displayed on the success screen alongside the pay button.
		divorceWith: '$259.95',
		divorceWithOut: '$159.95'
	}
};
