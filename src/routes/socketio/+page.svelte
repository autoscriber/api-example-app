<script>
	import { onDestroy } from 'svelte';
	import fastJsonPatch from 'fast-json-patch';
	const { applyPatch, deepClone } = fastJsonPatch;
	import AudioRecorder from '$lib/AudioRecorder.svelte';
	import ResponseBox from '$lib/ResponseBox.svelte';
	import io from 'socket.io-client';

	let state;
	let socket;

	async function handleAudioChunk(event) {
		if (event.detail.index === 0) {
			state = {};
			await connect();
		}
		const { index, base64, final } = event.detail;
		socket.emit('chunk', JSON.stringify({ index, base64, final }), (response) => {
			console.log('Server acknowledgement:', response);
		});
	}

	async function connect() {
		const response = await fetch('/socketio');
		const { endpoint, path, token } = await response.json();
		socket = io(endpoint, {
			path,
			query: { access_token: token }
		});
		socket.on('connect', () => {
			console.log('Connected to socket:', socket.id);
		});
		socket.on('patch', (data) => {
			state = applyPatch(deepClone(state), deepClone(data.operations)).newDocument;
		});
		socket.on('finalized', () => disconnect());
	}

	function disconnect() {
		if (socket) {
			socket.disconnect();
			console.log('Socket disconnected');
		}
	}

	onDestroy(() => disconnect());
</script>

<p><a href="/">Go back</a></p>
<h1>Socket.IO example</h1>

<div class="info-box">
	<p>
		Your backend (that stores the API key) creates the socket and provides the connection
		information to the client. Your client can then connect to the socket directly and post audio &
		receive results.
	</p>
</div>

<AudioRecorder chunkInterval={5000} on:audioChunk={handleAudioChunk} />
<ResponseBox {state} />
