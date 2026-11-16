import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://xhamster.com/";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/https?:[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const url of matches as string[]) {
      if (url.includes("thumb")) continue;
      let q = "auto";
      if (url.includes("1080")) q = "1080p";
      else if (url.includes("720")) q = "720p";
      else if (url.includes("480")) q = "480p";
      streams.push({ server: `T3 ${q}`, link: url, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
    }
  } catch {}
  return streams;
};
