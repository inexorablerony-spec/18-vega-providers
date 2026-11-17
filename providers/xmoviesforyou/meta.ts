import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const BASE = "https://xmoviesforyou.com";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "XMoviesForYou";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const linkList: any[] = [];
    const videoIdMatch = html.match(/videoId\s*=\s*"?(\d+)"?/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      try {
        const streamRes = await axios.get(`${BASE}/api/stream/${videoId}`, { headers: { "User-Agent": UA }, timeout: 10000 });
        const streamData = streamRes.data;
        if (streamData && streamData.url) {
          linkList.push({ title: "Play", quality: "HD", directLinks: [{ title: "HLS", link: streamData.url, type: "m3u8" }] });
        }
      } catch {}
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
