import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "XHamster";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const linkList: any[] = [];
    const matches = html.match(/https?:[^"'\s]+\.(?:mp4|m3u8)[^"'\s]*/gi) || [];
    for (const url of [...new Set(matches)]) {
      if ((url as string).includes("thumb") || (url as string).includes("preview")) continue;
      const type = (url as string).includes(".m3u8") ? "m3u8" : "mp4";
      linkList.push({ title: "Play", quality: "HD", directLinks: [{ title: "Play", link: url, type }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
