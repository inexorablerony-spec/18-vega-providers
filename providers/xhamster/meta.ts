import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const BASE = "https://xhamster.one";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "XHamster";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const linkList: any[] = [];
    const embedMatch = html.match(/xh\.video\/p\/([a-zA-Z0-9]+)/);
    if (embedMatch) {
      const embedUrl = `https://xh.video/p/${embedMatch[1]}`;
      linkList.push({ title: "Play", quality: "HD", directLinks: [{ title: "Play", link: embedUrl, type: "embed" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
