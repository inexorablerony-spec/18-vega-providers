import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  let pathname = "";
  try { pathname = new URL(link).pathname; } catch { return []; }
  const extension = pathname.split(".").pop()?.toLowerCase();
  let type = "";
  if (extension === "mp4") type = "mp4";
  else if (extension === "m3u8") type = "m3u8";
  else if (extension === "mpd") type = "mpd";
  else return [];
  return [{ server: "spankbang", link, type, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36", "Referer": "https://spankbang.com/", "Accept": "*/*" } }];
};
