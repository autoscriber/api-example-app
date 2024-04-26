<script>
	import fastJsonPatch from 'fast-json-patch';
	const { applyPatch, deepClone } = fastJsonPatch;
	import AudioRecorder from '$lib/AudioRecorder.svelte';
	import ResponseBox from '$lib/ResponseBox.svelte';

	let state;
	let postUri;
	let eventSource;

	async function handleAudioChunk(event) {
		if (event.detail.index === 0) {
			// Properly close the existing EventSource if it exists and is not already closed
			if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
				eventSource.close();
				eventSource = null; // Clear the reference to the closed EventSource
			}
			state = {};
			const response = await fetch('/sse');
			const data = await response.json();
			postUri = data.chunkLocation;
			startSSE(data.location);
		}
		const { index, base64, final } = event.detail;
		await fetch(postUri, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ index, base64, final })
		});
	}

	function startSSE(sseUri) {
		eventSource = new EventSource(sseUri);

		eventSource.onmessage = function (event) {
			const data = JSON.parse(event.data);
			state = applyPatch(deepClone(state), deepClone(data.operations)).newDocument;
		};

		eventSource.onerror = function (error) {
			console.error(error);
			eventSource.close();
		};

		return {
			destroy() {
				eventSource.close();
			}
		};
	}
</script>

<p><a href="/">Go back</a></p>
<h1>Server-Sent Events example</h1>
<div class="info-box">
	<p>
		Read more about server-sent events <a
			href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events"
			target="_blank">here</a
		>. Your backend (that stores the API key) creates the resource. Your client can then post audio
		directly to the Autoscriber API and access the event stream with results.
	</p>
</div>

<AudioRecorder chunkInterval={5000} on:audioChunk={handleAudioChunk} />
<ResponseBox {state} />
