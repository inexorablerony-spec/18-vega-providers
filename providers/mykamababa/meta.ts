import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "MyKamababa";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const linkList: any[] = [];
    const mp4Match = html.match(/https?:\/\/cdn\.mykamababa\.com\/[^"'\s]+\.mp4/gi) || [];
    for (const url of [...new Set(mp4Match)]) {
      linkList.push({ title: "Play", quality: "HD", directLinks: [{ title: "Play", link: url, type: "mp4" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
