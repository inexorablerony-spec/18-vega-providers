import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  let pathname = "";
  try { pathname = new URL(link).pathname; } catch { return []; }
  if (!/\.mp4$/i.test(pathname)) return [];
  return [{ server: "sxyprn", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://sxyprn.com/", "Accept": "*/*" } }];
};
