import { json } from '@sveltejs/kit';

const username = import.meta.env.VITE_SVELTEKIT_PRIVATE_BASIC_AUTH_USERNAME;
const password = import.meta.env.VITE_SVELTEKIT_PRIVATE_BASIC_AUTH_PASSWORD;
const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

export async function POST({ request, url }) {
	const requestBody = await request.json();
	const response = await fetch(import.meta.env.VITE_SVELTEKIT_PRIVATE_API_URI + 'scribe', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'api-key': import.meta.env.VITE_SVELTEKIT_PRIVATE_API_KEY
		},
		body: JSON.stringify({
			communication: {
				method: 'webhook',
				webhook: {
					uri: url.origin + '/webhook/callback',
					headers: { Authorization: basicAuth }
				}
			},
			in: [{ type: 'text', language: 'en', text: requestBody.text }],
			out: [{ type: 'note/standard_en' }]
		})
	});
	return json(await response.json());
}
