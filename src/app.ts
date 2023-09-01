import FormData from "form-data";
import fs from "fs";
import { market_open, sendWebhook } from "./utils";
import dotenv from "dotenv";

dotenv.config();

const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!WEBHOOK_URL) {
  throw new Error("Make sure WEBHOOK_URL is initialized as an env variable");
}

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();

const data = {
  username: "Beep-Bop",
  embeds: [
    {
      title: `Market Status: 📅 ${month}/${day} - SPY Futures`,
      color: market_open(date) ? 5174599 : 16728128,
      footer: {
        text: `📅 ${month}/${day}/${year}`,
      },
      fields: [
        {
          name: "Market",
          value: "Spy Futures",
        },
      ],
      image: {
        url: "attachment://us-spx-500-futures.png",
      },
    },
    {
      title: `Market Status: 📅 ${month}/${day} - S&P 500`,
      color: market_open(date) ? 5174599 : 16728128,
      footer: {
        text: `📅 ${month}/${day}/${year}`,
      },
      fields: [
        {
          name: "Market",
          value: "S&P 500",
        },
      ],
      image: {
        url: "attachment://us-spx-500.png",
      },
    },
    {
      title: `Market Status: 📅 ${month}/${day} - USD JPY Pair`,
      color: 5174599,
      footer: {
        text: `📅 ${month}/${day}/${year}`,
      },
      fields: [
        {
          name: "Forex",
          value: "USD JPY Pair",
        },
      ],
      image: {
        url: "attachment://usd-jpy.png",
      },
    },
  ],
};

const form = new FormData();
form.append("payload_json", JSON.stringify(data));
form.append("file1", fs.createReadStream("usd-jpy.png"));
form.append("file2", fs.createReadStream("us-spx-500.png"));
form.append("file3", fs.createReadStream("us-spx-500-futures.png"));

(async function () {
  const response = await sendWebhook(WEBHOOK_URL, form);

  if (response.status === 200) {
    console.log("Webhook delivered successfully");
  } else {
    console.log("Webhook delivery failed");
    throw new Error("Could not deliver webhook");
  }
})();
