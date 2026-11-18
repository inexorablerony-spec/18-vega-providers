import { Stream } from "../types";

export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  const clean = link.replace(/&amp;/g, "&");
  if (clean.includes("preview") || clean.includes("trailer")) return [];

  let quality = "HD";
  const qMatch = clean.match(/_(\d+p)\.mp4/i);
  if (qMatch) quality = qMatch[1];
  else if (clean.includes("_4k.mp4") || clean.includes("_2160p.mp4")) quality = "2160p";

  return [{
    server: `AlotPorn ${quality}`,
    link: clean,
    type: "mp4",
    headers: { Referer: "https://www.alotporn.com/", "User-Agent": "Mozilla/5.0" }
  }];
};
