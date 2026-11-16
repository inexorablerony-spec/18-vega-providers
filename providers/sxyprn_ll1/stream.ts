import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://sxyprn.com/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const torrentMatch = html.match(/myporn\.club\/t\/([a-zA-Z0-9]+)/);
    if (torrentMatch) {
      const torrentId = torrentMatch[1];
      const torrentUrl = `https://myporn.club/t/${torrentId}`;
      try {
        const tRes = await axios.get(torrentUrl, { headers: { "User-Agent": UA }, timeout: 15000 });
        const tHtml = tRes.data || "";
        const magnetMatch = tHtml.match(/magnet:\?[^"'\s]+/);
        if (magnetMatch) {
          streams.push({ server: "SxyPrn Torrent", link: magnetMatch[0], type: "magnet", headers: { "User-Agent": UA } });
        }
        const dlMatch = tHtml.match(/download\.php\?[^"'\s]+/);
        if (dlMatch) {
          streams.push({ server: "SxyPrn Download", link: "https://myporn.club/" + dlMatch[0], type: "mp4", headers: { "User-Agent": UA } });
        }
      } catch {}
    }
    if (streams.length === 0) {
      streams.push({ server: "LL1", link, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
    }
  } catch {}
  return streams;
};
