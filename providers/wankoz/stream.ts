import { Stream } from "../types";

export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  
  const clean = link.replace(/&amp;/g, "&");
  if (clean.includes("preview")) return [];

  // Extract quality from URL
  let quality = "HD";
  if (clean.includes("_a.mp4")) quality = "1080p";
  else if (clean.includes("_s.mp4")) quality = "720p";

  return [{ 
    server: `Wankoz ${quality}`, 
    link: clean, 
    type: "mp4", 
    headers: { Referer: "https://www.wankoz.com/", "User-Agent": "Mozilla/5.0" } 
  }];
};
