import { json } from '@sveltejs/kit';

export async function GET() {
	const response = await fetch(import.meta.env.VITE_SVELTEKIT_PRIVATE_API_URI + 'scribe', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'api-key': import.meta.env.VITE_SVELTEKIT_PRIVATE_API_KEY
		},
		body: JSON.stringify({
			region: 'any',
			communication: { method: 'socketio' },
			in: [{ type: 'conversation', audioType: 'webm', language: 'en' }],
			out: [{ type: 'soap_en' }]
		})
	});
	return json(await response.json());
}
