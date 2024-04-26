<script>
	export let state;

	function highlightJSON(json) {
		if (json === undefined) return {};
		const jsonString = JSON.stringify(json, null, 2);
		const escapedHtml = jsonString
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		const highlightedHtml = escapedHtml.replace(
			/"(.*?)":/g,
			'"<span style="color:#00b7f0;">$1</span>":'
		);
		return highlightedHtml;
	}
</script>

<div class="info-box">
	{#if state && Object.keys(state).length > 0}
		<pre><code>{@html highlightJSON(state).trim()}</code></pre>
	{:else}
		<pre><code>No results yet</code></pre>
	{/if}
</div>

<style>
	.info-box {
		border-left: 5px solid #00b7f0;
	}
</style>
