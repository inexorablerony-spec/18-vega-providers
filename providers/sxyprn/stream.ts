import { Stream } from "../types";

export const getStream = async function ({
  link
}: {
  link: string;
}): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];

  const isVideo = /\.(?:mp4|vid)(?:$|[?#])/i.test(link) || /\/(?:cdn5?|vidi)\//i.test(link);

  if (!isVideo) return [];

  return [{
    server: "sxyprn",
    link,
    type: "mp4",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://sxyprn.com/",
      "Accept": "*/*"
    }
  }];
};
