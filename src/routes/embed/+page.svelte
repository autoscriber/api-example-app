<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let embedLocation;
	let result;

	onMount(async () => {
		embedLocation = new URLSearchParams(window.location.search).get('uri') || '';
		if (!embedLocation) {
			const response = await fetch('/embed', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ crossOriginTarget: window.location.origin })
			});
			const data = await response.json();
			if (data.embedLocation) {
				embedLocation = data.embedLocation;
				// Update url so recording can continue without problems when the page is refreshed
				goto(`/embed?uri=${encodeURIComponent(embedLocation)}`, { replaceState: true });
			}
		}
		window.addEventListener('message', (event) => {
			// Always verify the origin of the message!
			if (event.origin === new URL(embedLocation).origin) result = event.data;
		});
	});
</script>

<p><a href="/">Go back</a></p>
<h1>Embedded example (iframe)</h1>
<div class="info-box">
	<p>
		You can embed the Autoscriber UI into your own site using an iframe, here illustrated with
		cross-origin data sharing, check out the <a
			href="https://developers.autoscriber.com"
			target="_blank">documentation</a
		> for other options.
	</p>
</div>

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
		<h2>State received from iframe</h2>
		<div class="box">
			<pre>{result ? JSON.stringify(result, null, 2) : 'Nothing received yet'}</pre>
		</div>
	</div>
</div>

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
