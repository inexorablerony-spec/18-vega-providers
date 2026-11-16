import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const TRACKERS = "&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.openbittorrent.com:6969/announce&tr=udp://open.stealth.si:80/announce";
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
      const magnetMatch = (tRes.data || "").match(/magnet:\?xt=urn:btih:[a-f0-9]+/);
      if (magnetMatch) streams.push({ server: "T2 Trackers", link: magnetMatch[0] + TRACKERS, type: "torrent" });
    }
  } catch {}
  return streams;
};
