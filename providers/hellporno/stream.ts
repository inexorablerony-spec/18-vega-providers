import { Stream } from "../types";

export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  const clean = link.replace(/&amp;/g, "&");
  
  // Skip trailers
  if (clean.includes("trailer") || clean.includes("preview")) return [];

  const qMatch = clean.match(/_(\d+p)\.mp4/i);
  const quality = qMatch ? qMatch[1] : "720p";

  return [{
    server: `HellPorno ${quality}`,
    link: clean,
    type: "mp4",
    headers: { Referer: "https://hellporno.com/", "User-Agent": "Mozilla/5.0" }
  }];
};
