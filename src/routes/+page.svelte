<h1>Autoscriber API example app</h1>

<div class="info-box">
	<p>
		The <b>Autoscriber API</b> can be implemented in multiple ways, below you find some examples.
		Note that the code has only be tested in Chrome. Visit
		<a href="https://developers.autoscriber.com" target="_blank">developers.autoscriber.com</a> to read
		more about the api.
	</p>
</div>

<h4 style="margin-top:100px">/embed</h4>
<nav>
	<ol>
		<li><a href="/embed">Iframe (cross-origin)</a></li>
		<li>
			<a href="/embed-webhook"
				>Iframe (webhook) <span style="font-weight:bold;color:#00b7f0">this requires ngrok (!)</span
				></a
			>
		</li>
	</ol>
</nav>
<h4>/scribe</h4>
<nav>
	<ol>
		<li><a href="/socketio">Method socket.io (post live audio chunks)</a></li>
		<li><a href="/sse">Method server-sent events (post live audio chunks)</a></li>
		<li><a href="/get">Method get (post an audio recording)</a></li>
		<li>
			<a href="/webhook"
				>Method webhook (post a text document) <span style="font-weight:bold;color:#00b7f0"
					>this requires ngrok (!)</span
				></a
			>
		</li>
	</ol>
</nav>
