import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const requestBody = await request.json();
	const id = '';

	let response;
	if (id)
		response = await fetch(import.meta.env.VITE_SVELTEKIT_PRIVATE_API_URI + `embed/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'api-key': import.meta.env.VITE_SVELTEKIT_PRIVATE_API_KEY
			}
		});
	else
		response = await fetch(import.meta.env.VITE_SVELTEKIT_PRIVATE_API_URI + 'embed', {
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
					crossOriginTarget: requestBody.crossOriginTarget,
					theme: {
						primaryColor: '#00b7f0' // '#9E2F3C'
					},
					specialty: 'GP',
					newTemplate: true,
					askConsent: true,
					toggleCodes: false
				}
			})
		});

	return json(await response.json());
}
