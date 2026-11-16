import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://xhamster.one/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    if (link.includes("xh.video")) {
      streams.push({ server: "XH Embed", link, type: "embed", headers: { "User-Agent": UA, Referer: REFERER } });
      return streams;
    }
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const embedMatch = html.match(/xh\.video\/p\/([a-zA-Z0-9]+)/);
    if (embedMatch) {
      const embedUrl = `https://xh.video/p/${embedMatch[1]}`;
      streams.push({ server: "XH Embed", link: embedUrl, type: "embed", headers: { "User-Agent": UA, Referer: REFERER } });
    }
  } catch {}
  return streams;
};
