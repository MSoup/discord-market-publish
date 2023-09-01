import axios, { AxiosResponse } from "axios";

export const getFilename = (URL: string): string => {
  // split URL by /
  const segmented = URL.split("/");
  // select last segment
  const endUrl = segmented[segmented.length - 1];
  // remove -chart and use as filename
  const filename = endUrl.slice(0, endUrl.indexOf("-chart"));

  return filename;
};
