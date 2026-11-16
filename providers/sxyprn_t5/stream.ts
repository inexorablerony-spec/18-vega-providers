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
      const id = torrentMatch[1];
      const tRes = await axios.get(`https://myporn.club/t/${id}`, { headers: { "User-Agent": UA }, timeout: 15000 });
      const magnetMatch = (tRes.data || "").match(/magnet:\?[^"'\s]+/);
      if (magnetMatch) streams.push({ server: "T5 Magnet", link: magnetMatch[0], type: "torrent" });
      streams.push({ server: "T5 File", link: `https://myporn.club/torrent/${id}`, type: "torrent" });
    }
  } catch {}
  return streams;
};
