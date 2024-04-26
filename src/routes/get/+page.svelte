<script>
	import AudioRecorder from '$lib/AudioRecorder.svelte';
	import ResponseBox from '$lib/ResponseBox.svelte';

	let state = {};

	async function handleAudioChunk(event) {
		const { base64 } = event.detail;
		const response = await fetch('/get', {
			method: 'POST',
			body: JSON.stringify({ base64 })
		});
		state = await response.json();
	}
</script>

<p><a href="/">Go back</a></p>
<h1>Get example</h1>
<div class="info-box">
	<p>
		This example sends audio once and gets the result. We recommend to take a look at the other
		examples if you want intermediate results.
	</p>
</div>

<AudioRecorder on:audioChunk={handleAudioChunk} />
<ResponseBox {state} />
