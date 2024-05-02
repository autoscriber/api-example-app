import { json } from '@sveltejs/kit';

const username = import.meta.env.VITE_SVELTEKIT_PRIVATE_BASIC_AUTH_USERNAME;
const password = import.meta.env.VITE_SVELTEKIT_PRIVATE_BASIC_AUTH_PASSWORD;
const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

export async function POST({ url }) {
	const response = await fetch(import.meta.env.VITE_SVELTEKIT_PRIVATE_API_URI + 'embed', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'api-key': import.meta.env.VITE_SVELTEKIT_PRIVATE_API_KEY
		},
		body: JSON.stringify({
			region: 'any',
			priority: 1,
			billingReference: 'example-app',
			userId: 'not-provided',
			config: {
				persist: true,
				displayName: 'Demo patient',
				webhook: {
					url: url.origin + '/embed-webhook/callback',
					headers: { Authorization: basicAuth }
				},
				theme: {
					primaryColor: '#00b7f0' // '#9E2F3C'
				},
				languages: ['nl', 'en'],
				out_types: ['episodes/soap_nl'], // 'note/standard_en', 'note/standard_nl',
				newTemplate: true,
				askConsent: true,
				toggleCodes: true,
				editing: true
			}
		})
	});
	return json(await response.json());
}
