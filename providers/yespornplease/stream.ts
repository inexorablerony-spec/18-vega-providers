import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "yespornplease", link: link.replace(/&amp;/g, "&"), type: "mp4", headers: { Referer: "https://yespornplease.xxx/", "User-Agent": "Mozilla/5.0" } }];
};
