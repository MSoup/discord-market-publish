# Market Status Automation

## Setup

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

You can also run `npx playwright --show-report` to see a detailed report of what was run.

![Example Playwright Output](assets/example_spec.png)

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
npx ts-node src/app.ts
```

If successful, your console should log `"Webhook delivered successfully"`.

## Motivation

This project was inspired by a daily interaction between friends of mine. For years, we took the time to screenshot the state of the market and share them with each other.

Eventually, I stumbled upon the idea of Discord webhooks, and was able to invoke it with this tiny curl command snippet

```bash
# A script to send an image over to discord
% curl -H 'Content-Type: multipart/form-data' \
   -F 'payload_json={"username": "test", "content": "hello"}' \
   -F "file1=@usd-jpy.png" \
   $WEBHOOK_URL
```

That spawned this whole project where I

- use Playwright to take screenshots of the state of the market for SPY, SPY Futures, and the USD JPY currency pair
- store the resulting files locally
- invoke src/app.ts to send a POST request to the discord webhook

## Installation

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
playwright.config.ts

This TypeScript configuration file is used to define various settings and options for configuring Playwright's behavior during test execution. It may include settings such as browser type, test environment, test timeouts, and more.
readme.md

The README file typically provides an introduction to the project, setup instructions, usage guidelines, and any other essential information for developers, testers, or contributors. It's often the first thing people read when they explore the project.
src (Directory)

This directory may contain the source code for the application or tests being automated using Playwright. It might include the application's source files, scripts, utilities, or other relevant code.
test-results (Directory)

This directory could be used to store the output of test runs, including reports, logs, screenshots, and other artifacts generated during test execution using Playwright.
tests (Directory)

The tests directory likely holds the actual test scripts written using Playwright's API. These scripts are responsible for automating interactions with the application under test and verifying its behavior.

### Usage and Workflow

#### Configuration:

Modify the playwright.config.ts file to customize Playwright's settings according to your testing needs, such as browser type, environment setup, and timeouts.

#### Running Tests:

Execute the tests using npm commands defined in the package.json file. For example, `npx playwright test`
