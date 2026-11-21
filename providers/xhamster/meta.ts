import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://xhamster.com/" }, timeout: 20000 });
    const html = String(res.data || "").replace(/\\\//g, "/");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const m = html.match(/https:\/\/[a-z0-9.\-]*xhcdn\.com\/[^"'\s]+?\.m3u8/i);
    const directLinks = m ? [{ title: "HLS", link: m[0], type: "m3u8" }] : [];
    const linkList = directLinks.length ? [{ title: "Play", quality: "HLS", directLinks }] : [];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
