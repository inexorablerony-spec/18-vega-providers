import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://sxyprn.com/";
const BASE = "https://sxyprn.com";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const vnfoMatch = html.match(/data-vnfo=['"]([^'"]+)['"]/);
    if (!vnfoMatch) return [];
    try {
      const data = JSON.parse(vnfoMatch[1].replace(/&quot;/g, '"'));
      for (const path of Object.values(data)) {
        if (typeof path !== "string") continue;
        let url = path;
        if (url.startsWith("/")) url = BASE + url;
        else if (!url.startsWith("http")) url = BASE + "/" + url;
        streams.push({ server: "SP2 VNFO", link: url, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
      }
    } catch {}
  } catch {}
  return streams;
};
