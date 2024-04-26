# Autoscriber API example app

This is an example app for the Autoscriber [`API`](https://developers.autoscriber.com).

## API_KEY and ENV file

The first step is to get an Autoscriber developer account and get an api key.
Rename the file `.env_template` to `.env` and update the api key.
Note that for production use cases you'll never want to store the api key as a PUBLIC_ENV.

## Install dependencies

Installed dependencies with `npm install` (or `pnpm install` or `yarn`).

```bash
npm install
```

## Try it out

Start a development server:

```bash
npm run dev
```

## Start NGROK server

Examples that make use of a webhook require you to setup a [`NGROK`](https://ngrok.com) server (or a similar solution).
You can sign up at NGROK (for free) after sign up instructions are provided to install NGROK. For mac they will be similar to:

```bash
brew install ngrok/ngrok/ngrok # On a Mac, check NGROK instructions for other platforms
```

```bash
ngrok config add-authtoken <PROVIDED BY NGROK.COM AFTER SIGNUP>
```

Start NGROK with the port that your Svelte development server is listening to e.g. [`5173`]. For added security include basic auth username and password.

```bash
ngrok http 5173 --basic-auth 'YOUR_USERNAME:YOUR_PASSWORD'
```
