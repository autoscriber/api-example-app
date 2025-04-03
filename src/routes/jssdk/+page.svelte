<script>
	import Scribe, { SPECIALTIES } from 'autoscriber';
	import { onMount } from 'svelte';
	import ResponseBox from '$lib/ResponseBox.svelte';

	let state = null;
	let scribe = null;
	let microphones = [];
	let selectedMicrophone = 'Please select a microphone';
	let dropdownMessage = 'Please select a microphone';
	let isRecording = undefined;
	let availableTemplates = [];
	let selectedTemplate = 'Please select a template to generate';
	let regenerateAvailableTemplates = [];
	let regenerateSelectedTemplate = 'Please select a template to regenerate';

	function generateNewOutput() {
		// Generate a new output using the SDK
		scribe.generateNewOutput(selectedTemplate);
	}

	function regenerateOutput() {
		// Regenerate an already existing output using the SDK.
		scribe.regenerateOutput(regenerateSelectedTemplate);
	}

	function startRecording() {
		//Start recording in the SDK, this will automatically update our stateListener with the real-time transcript
		scribe.startRecording(selectedMicrophone);
		isRecording = true;
	}

	function pauseRecording() {
		//Start recording in the SDK, this will automatically update our stateListener with the real-time transcript
		scribe.pauseRecording();
		isRecording = true;
	}

	function resumeRecording() {
		//Start recording in the SDK, this will automatically update our stateListener with the real-time transcript
		scribe.resumeRecording();
		isRecording = true;
	}


	function stopRecording() {
		isRecording = false;
		// Stop recording in the SDK, this will automatically kick off output generation
		scribe.stopRecording();

		// Get remaining available out types so that we can prompt the user to generate new notes with the remaining out types
		availableTemplates = scribe.getAvailableOutTypes();
	}

	function stateListener(data) {
		// Update our local state variable with the updated state from the SDK
		state = data;

		// Check all generated outputs
		if (state && Object.keys(state).length > 0) {
			regenerateAvailableTemplates = Object.keys(state).filter((key) => key !== 'conversation');
		}
	}

	// Create a connection to the scribe api endpoint
	const createConnection = async (scribe) => {
		const { promise, resolve, reject } = Promise.withResolvers();
		try {
			const connectionStatus = await scribe.connect();
			resolve(connectionStatus);
		} catch (err) {
			reject(err);
		}
		return promise;
	};

	onMount(async () => {
		// Do the initial authorization and setup call to /scribe api endpoint
		const response = await fetch('/jssdk');

		// Assign response from /scribe endpoint to our config variable
		let connectionConfig = await response.json();

		// Init the sdk with the config we built
		scribe = new Scribe(connectionConfig, stateListener);

		// Create a connection to the scribe api endpoint
		await createConnection(scribe);

		// Get all available recording devices on the machine using the SDK
		const { availableMicrophones } = await scribe.getAvailableRecordingDevices();
		
		microphones = availableMicrophones;

	});
</script>

<p><a href="/">Go back</a></p>
<h1>SDK example ( Typescript )</h1>
<div class="info-box">
	<p>
		You can install the Autoscriber typescript SDK to create a scribe, record audio, receive a
		transcript, receive a note and generate new notes. Check out the <a
			href="https://developers.autoscriber.com"
			target="_blank">documentation</a
		> for other options.
	</p>
</div>

{#if state && !state.conversation?.final}
	<div class="container">
		{#if microphones.length > 0}
			<select bind:value={selectedMicrophone} class="dropdown">
				<option disabled selected>{dropdownMessage}</option>
				{#each microphones as mic}
					<option value={mic.deviceId}>{mic.name}</option>
				{/each}
			</select>
		{/if}

		<button
			class="btn"
			disabled={selectedMicrophone === 'Please select a microphone'}
			on:click={() => {
				if (isRecording === undefined) {
					startRecording();
				} else {
					stopRecording();
				}
			}}>{isRecording ? 'Stop Recording' : 'Start Recording'}</button
		>
		<button
		class="btn"
		on:click={pauseRecording}>Pause</button
	>
	<button
	class="btn"
	on:click={resumeRecording}>Resume</button
>
	</div>
{/if}

{#if state && state.conversation?.final}
	<div class="container">
		{#if regenerateAvailableTemplates.length > 0}
			<select bind:value={regenerateSelectedTemplate} class="dropdown">
				<option disabled selected>{regenerateSelectedTemplate}</option>
				{#each regenerateAvailableTemplates as template}
					<option value={template}>{template}</option>
				{/each}
			</select>
		{/if}

		<button
			class="btn"
			disabled={regenerateSelectedTemplate === 'Please select a template to regenerate'}
			on:click={regenerateOutput}>Regenerate output</button
		>
	</div>

	{#if availableTemplates.length > 0}
		<select bind:value={selectedTemplate} class="dropdown">
			<option disabled selected>{selectedTemplate}</option>
			{#each availableTemplates as template}
				<option value={template}>{template}</option>
			{/each}
		</select>
	{/if}
	<button
		class="btn"
		disabled={selectedTemplate === 'Please select a template to generate'}
		on:click={generateNewOutput}>Generate new note</button
	>
{/if}

<ResponseBox {state} />

<style scoped>
	.container {
		width: 100%;
		margin-bottom: 5px;
	}

	.dropdown {
		height: 2rem;
		border-radius: 5px;
	}

	.btn:disabled {
		background-color: darkgray;
		cursor: not-allowed;
	}
	.btn:enabled {
		background-color: lightgray;
	}
</style>
