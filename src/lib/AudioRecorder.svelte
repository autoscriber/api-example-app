<!-- Props -->
<script context="module">
	export const props = ['chunkInterval'];
</script>

<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let recording = false;
	let stopped = false;
	let media = [];
	let mediaRecorder = null;
	let interval = null;
	let index = 0;
	let downloadMedia = [];

	function start() {
		record();
		recording = true;
		if ($$props.chunkInterval)
			interval = setInterval(() => {
				if (mediaRecorder && recording) {
					mediaRecorder.stop();
					record();
				}
			}, $$props.chunkInterval);
	}

	function stop() {
		recording = false;
		clearInterval(interval);
		mediaRecorder.stop();
	}

	function download() {
		const audioBlob = new Blob(downloadMedia, { type: 'audio/webm' });
		const url = window.URL.createObjectURL(audioBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'Audio_recording.webm';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	}

	function record() {
		navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 48000 } }).then((stream) => {
			if (!MediaRecorder.isTypeSupported('audio/webm'))
				console.log('Webm format is not supported.');
			mediaRecorder = new MediaRecorder(stream, {
				mimeType: 'audio/webm',
				bitsPerSecond: 256000
			});
			mediaRecorder.start();
			mediaRecorder.addEventListener('dataavailable', (event) => {
				media.push(event.data);
				downloadMedia.push(event.data);
			});
			mediaRecorder.addEventListener('stop', () => {
				stream.getTracks().forEach((track) => track.stop());
				const audioBlob = new Blob(media, { type: 'audio/webm' });
				media = [];
				const reader = new window.FileReader();
				reader.readAsDataURL(audioBlob);
				reader.onloadend = function () {
					let base64 = reader.result;
					base64 = base64.split(',')[1];
					dispatch('audioChunk', { base64, index: index++, final: stopped });
				};
			});
		});
	}
</script>

{#if !stopped}
	<div class="info-box">
		<div class="controls">
			{#if !recording}
				<p>Start the recording</p>
				<button on:click={start}>Record</button>
			{:else}
				<p style="color: #f00800; font-weight: bold;">Recording</p>
				<button
					on:click={() => {
						(stopped = true), stop();
					}}>Stop</button
				>
			{/if}
		</div>
	</div>
{:else}
	<div class="info-box download">
		<button on:click={download}>Download audio</button>
	</div>
{/if}

<style>
	.info-box {
		margin-top: 75px;
		border-left: 5px solid #f00800;
	}
	.download {
		border-left: 5px solid #45a000;
	}
	.controls {
		display: flex;
		align-items: center;
	}
	.controls > * {
		margin-right: 10px; /* Adjust spacing between elements */
	}
</style>
