import { Info, ProviderContext } from "../types";

const QUALITY: Record<number, string> = { 1: "360", 2: "480", 4: "720", 8: "1080" };

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://fullporner.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const directLinks: any[] = [];
    const iframe = html.match(/iframe[^>]+src=["']([^"']+)["']/i)?.[1] || "";
    const m = iframe.match(/\/(?:video|player)\/([a-z0-9]+)\/(\d+)/i);
    if (m) {
      const mediaId = m[1].split("").reverse().join("");
      const mask = parseInt(m[2], 10);
      for (const bit of [8, 4, 2, 1]) {
        if (mask & bit) {
          const q = QUALITY[bit];
          directLinks.push({ title: q + "p", link: `https://xiaoshenke.net/vid/${mediaId}/${q}`, type: "mp4" });
        }
      }
    }
    if (directLinks.length === 0) directLinks.push({ title: "Play", link, type: "mp4" });
    const linkList = [{ title: "Play", quality: directLinks[0].title, directLinks }];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
