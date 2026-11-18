import { Stream } from "../types";

export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  if (!/\.mp4/i.test(link)) return [];
  if (link.includes("preview")) return [];

  const qMatch = link.match(/-(\d+p)\.mp4/i);
  const quality = qMatch ? qMatch[1] : "HD";

  return [{
    server: `TNAFlix ${quality}`,
    link: link.replace(/&amp;/g, "&"),
    type: "mp4",
    headers: { Referer: "https://www.tnaflix.com/", "User-Agent": "Mozilla/5.0" }
  }];
};
