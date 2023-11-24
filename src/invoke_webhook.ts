import fs from 'fs';
import { APIEmbed } from 'discord.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import FormData from 'form-data';
// TypeScript also has a FormData type that can cause confusion
// if we do not explicitly import FormData from "form-data"

import axios from 'axios';
import { isMarketOpen } from './utils';

type MarketMetadata = {
  title: string;
  description: string;
  filename: string;
};

export const invokeWebhook = async (
  URL: string,
  { title, description, filename }: MarketMetadata
) => {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const embedData: APIEmbed = {
    title: title,
    description: description,
    color: isMarketOpen(new Date()) ? 5174599 : 16728128,
    footer: {
      text: `📅 ${month}/${day}/${year}`,
    },
    image: {
      url: `attachment://${filename}`,
    },
  };

  const payloadData = {
    username: 'Beep-Bop',
    embeds: [embedData],
  };

  const form = new FormData();
  form.append('payload_json', JSON.stringify(payloadData));
  form.append('file1', fs.createReadStream(`${filename}`));

  const response = await axios.post(URL, form, {
    headers: { 'content-type': 'multipart/form-data' },
  });

  if (response.status === 200) {
    console.log('Webhook delivered successfully');
  } else {
    console.log('Webhook delivery failed');
    throw new Error('Could not deliver webhook');
  }
};
