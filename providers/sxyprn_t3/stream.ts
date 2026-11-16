import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://sxyprn.com/" }, timeout: 20000 });
    const html = res.data || "";
    const torrentMatch = html.match(/myporn\.club\/t\/([a-zA-Z0-9]+)/);
    if (torrentMatch) {
      const tRes = await axios.get(`https://myporn.club/t/${torrentMatch[1]}`, { headers: { "User-Agent": UA }, timeout: 15000 });
      const hashMatch = (tRes.data || "").match(/btih:([a-f0-9]+)/);
      if (hashMatch) streams.push({ server: "T3 Hash", link: `magnet:?xt=urn:btih:${hashMatch[1]}`, type: "torrent" });
    }
  } catch {}
  return streams;
};
