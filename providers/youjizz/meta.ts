import { Info, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REFERER = "https://www.youjizz.com/";

function extractSources(html: string): any[] {
  const sources: any[] = [];
  const regex = /\{"quality":"(\d+)","filename":"([^"]+)"[^}]*"name":"([^"]+)"\}/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    sources.push({
      quality: match[1],
      filename: match[2].replace(/\\\//g, "/").replace(/&amp;/g, "&"),
      name: match[3],
    });
  }
  return sources;
}

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "YouJizz";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const fullImage = image.startsWith("//") ? "https:" + image : image;
    const linkList: any[] = [];
    const sources = extractSources(html);
    for (const source of sources) {
      let url = source.filename;
      if (url.startsWith("//")) url = "https:" + url;
      linkList.push({
        title: source.name,
        quality: source.name,
        directLinks: [{ title: source.name, link: url, type: "mp4" }],
      });
    }
    return { title, synopsis: "", image: fullImage, imdbId: "", type: "movie", linkList };
  } catch { return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] }; }
};
