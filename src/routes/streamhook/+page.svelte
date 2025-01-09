<script>
	import { onMount } from 'svelte';
	import fastJsonPatch from 'fast-json-patch';
	const { applyPatch, deepClone } = fastJsonPatch;
	import AudioRecorder from '$lib/AudioRecorder.svelte';
	import ResponseBox from '$lib/ResponseBox.svelte';

	let ngrokWarning = null;
	onMount(() => {
		if (!window.location.href.includes('ngrok'))
			ngrokWarning =
				"Make sure to access the application via ngrok, as localhost can't be reached by the API server for the callback";
	});

	let id = null;
	async function checkId() {
		const response = await fetch(`/streamhook/callback?id=${id}`);
		const result = await response.json();
		if (result === 0) setTimeout(() => checkId(), 1000);
		else state = result;
	}

	let state;
	let postUri;
	async function handleAudioChunk(event) {
		if (event.detail.index === 0) {
			state = {};
			const response = await fetch('/streamhook');
			const data = await response.json();
			postUri = data.chunkLocation;
			id = data.id;
			checkId();
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
</script>

<p><a href="/">Go back</a></p>
<h1>Webhook example</h1>

<div class="info-box">
	<p>
		Read more about webhooks <a
			href="https://www.svix.com/resources/faq/webhooks-vs-long-polling/"
			target="_blank">here</a
		>
		and
		<a href="https://www.svix.com/resources/faq/webhook-vs-websocket/" target="_blank">here</a>
		.<br />
		In order for the webhook demo to work you need to have set up
		<a href="https://ngrok.com/" target="_blank">NGROK</a>, so that the Autoscriber API can reach
		your localhost.
	</p>
</div>

{#if ngrokWarning}
	<h4 style="color:red">{ngrokWarning}</h4>
{:else}
	<AudioRecorder chunkInterval={2000} on:audioChunk={handleAudioChunk} />
	<ResponseBox {state} />
{/if}
