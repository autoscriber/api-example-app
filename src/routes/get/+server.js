import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const requestBody = await request.json();
	const response = await fetch(import.meta.env.VITE_SVELTEKIT_PRIVATE_API_URI + 'scribe', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'api-key': import.meta.env.VITE_SVELTEKIT_PRIVATE_API_KEY
		},
		body: JSON.stringify({
			communication: { method: 'get' },
			in: [{ type: 'audio/base64', audioType: 'webm', language: 'en', base64: requestBody.base64 }],
			out: [{ type: 'note/standard_en' }]
		})
	});
	const result = await response.json();
	const getResponse = await fetch(result.location);
	return json(await getResponse.json());
}
