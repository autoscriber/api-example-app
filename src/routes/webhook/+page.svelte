<script>
	import { onMount } from 'svelte';
	import ResponseBox from '$lib/ResponseBox.svelte';

	let ngrokWarning = null;
	let id = null;
	let state = {};

	async function generateSoap() {
		const response = await fetch('/webhook', {
			method: 'POST',
			body: JSON.stringify({ text })
		});
		const result = await response.json();
		id = result.id;
		checkId();
	}

	async function checkId() {
		const response = await fetch(`/webhook/callback?id=${id}`);
		const result = await response.json();
		if (result === 0) setTimeout(() => checkId(), 1000);
		else state = result;
	}

	onMount(() => {
		if (!window.location.href.includes('ngrok'))
			ngrokWarning =
				"Make sure to access the application via ngrok, as localhost can't be reached by the API server for the callback";
	});

	let text = `doctor: How are you feeling today?
patient: Not good, I've been having a headache for the past few days.
doctor: Can you describe the headache? Is it more like a throbbing pain or a constant ache?
patient: It's more like a constant ache, and it gets worse in the afternoon.
doctor: Have you noticed anything that makes it better or worse? Like certain activities or times of day?
patient: Bright lights seem to make it worse. I haven't found anything that makes it better yet.
doctor: How about your sleep? Have you been sleeping well?
patient: Not really, the headache sometimes wakes me up at night.
doctor: Have you taken any medication for it?
patient: Just over-the-counter pain relievers, but they don't seem to help much.
doctor: It's important to manage your headache properly. I'll recommend some tests to rule out any underlying conditions, and we might need to consider prescription medication. Let's also talk about your stress levels and diet to see if there are any triggers we can address.
patient: Thank you, doctor. I hope we can find a way to manage this pain. It's been really affecting my daily life.
doctor: We'll work on it together.`;
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
{:else if !id}
	<textarea bind:value={text} style="width: 80%; height: 500px;"></textarea>
	<div style="margin-top: 20px;">
		<button on:click={generateSoap}>Generate soap note</button>
	</div>
{:else}
	<ResponseBox {state} />
{/if}
