import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://spankbang.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    const seen = new Set<string>();
    // SpankBang uses stream_url or video sources
    const re = /https?:\/\/[^"']+\.(mp4|m3u8)[^"']*/gi;
    for (const m of html.matchAll(re)) {
      let u = m[0].replace(/&amp;/g, "&");
      if (/preview|thumb|sprite/i.test(u)) continue;
      const clean = u.split("?")[0];
      if (seen.has(clean)) continue;
      seen.add(clean);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Stream", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
