import axios, { AxiosResponse } from "axios";
import FormData from "form-data";

// Be careful, as TypeScript also has a FormData type that can cause confusion
// if we do not explicitly import FormData from "form-data"

export const market_open = (time_now: Date) =>
  time_now.getHours() < 5 ||
  (time_now.getHours() >= 22 && time_now.getMinutes() >= 30) ||
  time_now.getHours() >= 23;

export async function sendWebhook(
  WEBHOOK_URL: string,
  form: FormData
): Promise<AxiosResponse> {
  try {
    const response = await axios.post(WEBHOOK_URL, form, {
      headers: { "content-type": "multipart/form-data" },
    });
    return response;
  } catch (error: any) {
    console.log(error.response.data);
    throw new Error(error);
  }
}
