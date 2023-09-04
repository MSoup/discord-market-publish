# Market Status Automation

## About

This tool allows you to

1. Create screenshots created from Playwright automation scripts that emulate an iPhone 13 environment on Safari.

2. Send the screenshots over to a Discord webhook of your choice, like below

<img src="assets/example_discord_embed.png" alt="Example Discord Embed" width="60%" height="60%">

## Setup

### Prerequisites

- node16 or higher

### Clone Repository

```bash
git clone git@github.com:MSoup/discord-market-publish.git
```

### Install Dependencies From Project Root

```bash
npm ci
```

## Web Automation (Screenshotting Market Instruments)

### Run Playwright to perform screenshot automation

```bash
npx playwright test
```

This should populate three screenshot files in your project root, like:

```bash
.
...
├── us-spx-500-futures.png
├── us-spx-500.png
└── usd-jpy.png
```

You can also run `npx playwright show-report` to see a detailed report of what was run.

<img src="assets/example_spec.png" alt="Example Test Results" width="80%">

## Invoking Discord Webhook

### Set Up Discord Webhook

Follow the instructions [here](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) up to the point where you copy the webhook url. It should be in the form of `https://discord.com/api/webhooks/{someLongHash}`

### Export the Webhook to an env variable

\*Make sure you replace the webhook URL with the actual one for your Discord channel. The `.env` file should be in your project root.

```bash
touch .env && echo WEBHOOK_URL="https://discord.com/api/webhooks/{someLongHash}"
```

### Invoke a POST request to your webhook

```bash
npm run invoke-webhook MARKET_SYMBOL
```

NOTE: `MARKET_SYMBOL` as of 9/5/2023 is one of: `'usd-jpy' | 'spy' | 'spy-futures'` as defined in `types.d.ts` here:

```typescript
type MarketSymbol = 'usd-jpy' | 'spy' | 'spy-futures';
```

`"invoke-webhook"` resolves to "npx ts-node src/app.ts"

If successful, your console should log `"Webhook delivered successfully"`.

### Project Structure

```bash
.
├── package-lock.json
├── package.json
├── playwright-report
├── playwright.config.ts
├── readme.md
├── src
├── test-results
└── tests

```

#### package-lock.json

Automatically generated by npm (Node Package Manager) and includes information about the exact versions of packages and dependencies installed in the project. We should not modify this file.

#### package.json

Contains metadata about the project, including its name, version, description, dependencies, and other configuration settings. It also defines scripts that can be executed using npm commands.

#### playwright-report (Directory)

Store generated reports or logs related to Playwright test execution as a result of running `npx playwright show-report`

#### playwright.config.ts

This TypeScript configuration file is used to define various settings and options for configuring Playwright's behavior during test execution. It includes settings such as browser type, test environment, test timeouts, and more.

Please note that this project has only been configured to work with mobile screen sizes that fit an iPhone 12/13/14.

#### readme.md

Hi

#### src (Directory)

Contains the entrypoint for the webhook invocation at `app.ts`. Also contains helper functions to be consumed by `app.ts` and the Playwright test suite.

#### tests (Directory)

Holds the actual test scripts written using Playwright's API. These scripts are responsible for emulating a browser environment on the device defined in `playwright.config.ts` in order to capture screenshots.

## Motivation

This project was inspired by a daily interaction between friends of mine. For years, we took the time to screenshot the state of the market and share them with each other.

Eventually, I stumbled upon the idea of Discord webhooks, and was able to invoke it with this tiny curl command snippet

```bash
# A script to send an image over to discord
% curl -H 'Content-Type: multipart/form-data' \
   -F 'payload_json={"username": "Beep-Bop", "content": "hello"}' \
   -F "file1=@usd-jpy.png" \
   $WEBHOOK_URL
```

That spawned this whole project.

### References:

- https://discord.com/developers/docs/resources/webhook
- https://discord.com/safety/using-webhooks-and-embeds
- https://playwright.dev/
- https://playwright.dev/docs/api/class-playwright
