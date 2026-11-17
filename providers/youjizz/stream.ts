import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://www.youjizz.com/";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.mp4/i.test(link)) { streams.push({ server: "YouJizz", link, type: "mp4", headers }); return streams; }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/\/\/cdne-mobile\.youjizz\.com[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const url of [...new Set(matches as string[])]) {
      const fullUrl = url.startsWith("//") ? "https:" + url : url;
      streams.push({ server: "YouJizz", link: fullUrl, type: "mp4", headers });
    }
  } catch {}
  return streams;
};
