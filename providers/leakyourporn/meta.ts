import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://leakyourporn.com/";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "LeakYourPorn";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const linkList: any[] = [];
    const mp4Matches = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const url of [...new Set(mp4Matches)] as string[]) {
      if (url.includes("preview") || url.includes("cdn")) {
        linkList.push({ title: "Play", quality: "Auto", directLinks: [{ title: "Play", link: url, type: "mp4" }] });
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] }; }
};
