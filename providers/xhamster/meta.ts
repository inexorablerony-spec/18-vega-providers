import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://xhamster.com/",
        Accept: "text/html,application/xhtml+xml",
      },
      timeout: 25000,
    });
    const html = String(res.data || "").replace(/\\\//g, "/");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const directLinks: any[] = [];
    const m3u8 = html.match(/https:\/\/[a-z0-9.\-]*xhcdn\.com\/[^"'\s]+?\.m3u8/gi) || [];
    for (const u of m3u8) {
      if (!directLinks.find((d: any) => d.link === u)) directLinks.push({ title: "HLS", link: u, type: "m3u8" });
    }
    const mp4 = html.match(/https:\/\/[a-z0-9.\-]*xhcdn\.com\/[^"'\s]+?\.mp4/gi) || [];
    for (const u of mp4) {
      if (!/preview|thumb|sprite/i.test(u) && !directLinks.find((d: any) => d.link === u)) {
        directLinks.push({ title: "MP4", link: u, type: "mp4" });
      }
    }

    const linkList = directLinks.length ? [{ title: "Play", quality: directLinks[0].title, directLinks }] : [];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return empty;
  }
};
