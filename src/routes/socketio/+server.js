import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		const response = await fetch(import.meta.env.VITE_SVELTEKIT_PRIVATE_API_URI + 'scribe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': import.meta.env.VITE_SVELTEKIT_PRIVATE_API_KEY
			},
			body: JSON.stringify({
				region: 'eu',
				communication: { method: 'socketio' },
				in: [{ type: 'conversation', audioType: 'webm', language: 'nl' }],
				out: [{ type: 'standaard_nl' }]
			})
		});
		return json(await response.json());
	} catch (error) {
		return json({ error: error.message });
	}
}
