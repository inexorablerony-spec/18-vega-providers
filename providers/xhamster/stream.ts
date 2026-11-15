import { Stream } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  let pathname = "";
  try { pathname = new URL(link).pathname; } catch { return []; }
  const extension = pathname.split(".").pop()?.toLowerCase();
  let type = "";
  if (extension === "mp4") type = "mp4";
  else if (extension === "m3u8") type = "m3u8";
  else return [];
  return [{ server: "xhamster", link, type, headers: { "User-Agent": UA, "Referer": "https://xhamster.com/", "Accept": "*/*" } }];
};
