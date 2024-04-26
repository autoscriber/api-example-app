<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let ngrokWarning = null;
	let id = null;
	let embedLocation;
	let state;

	async function checkId() {
		const response = await fetch(`/embed-webhook/callback?id=${id}`);
		const result = await response.json();
		if (result === 0) setTimeout(() => checkId(), 1000);
		else state = result;
	}

	onMount(async () => {
		if (!window.location.href.includes('ngrok')) {
			ngrokWarning =
				"Make sure to access the application via ngrok, as localhost can't be reached by the API server for the callback";
		} else {
			const response = await fetch('/embed-webhook', { method: 'POST' });
			const data = await response.json();
			id = data.id;
			embedLocation = data.embedLocation;
			checkId();
		}
	});
</script>

<p><a href="/">Go back</a></p>
<h1>Embedded example (webhook)</h1>
<div class="info-box">
	<p>
		You can embed the Autoscriber UI into your own site using an iframe, here illustrated with
		synchronization of data via a webhook, check out the <a
			href="https://developers.autoscriber.com"
			target="_blank">documentation</a
		> for other options.
	</p>
</div>

{#if ngrokWarning}
	<h4 style="color:red">{ngrokWarning}</h4>
{:else}
	<div class="container">
		<div>
			<h2>Iframe</h2>
			<div class="box">
				{#if embedLocation}
					<iframe
						title="Embedded Autoscriber app"
						src={embedLocation}
						allow="clipboard-write;microphone {embedLocation}"
					></iframe>
				{:else}
					<p>Something goes wrong with getting the uri</p>
				{/if}
			</div>
		</div>
		<div>
			<h2>Webhook result</h2>
			<div class="box">
				<pre>{state ? JSON.stringify(state, null, 2) : 'Nothing received yet'}</pre>
			</div>
		</div>
	</div>
{/if}

<style>
	.container {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 20px;
	}

	.box {
		border: 1px solid lightgrey;
		padding: 10px;
	}

	pre {
		white-space: pre-wrap; /* Allows text to wrap */
		word-break: break-word; /* Ensures long words do not overflow */
	}

	iframe {
		width: 100%;
		height: 1200px;
		border: none;
	}
</style>
