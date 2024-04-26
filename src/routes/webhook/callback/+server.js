import { json } from '@sveltejs/kit';
import { writeFileSync, readFileSync } from 'fs';

// Called by the Autoscriber API, stores the data to disk
export async function POST({ request }) {
	console.log('Callback has been called by API server');
	const body = await request.json();
	console.log(`Storing data for request ${body.id}`);
	writeFileSync(`static/callback/${body.id}.json`, JSON.stringify(body));
	return json({ success: true });
}

// Called by the front-end, to check if callback result has been stored to disk
export function GET({ url }) {
	try {
		const result = readFileSync(`static/callback/${url.searchParams.get('id')}.json`, {
			encoding: 'utf8',
			flag: 'r'
		});
		return json(JSON.parse(result));
	} catch (e) {
		return json(0);
	}
}
