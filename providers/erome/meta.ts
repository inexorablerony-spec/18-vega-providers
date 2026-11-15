import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://www.erome.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Album";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    // Erome has video sources in the page
    const sources = html.match(/https?:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/gi) || [];
    const seen = new Set<string>();
    for (const u of sources) {
      const clean = u.split("?")[0];
      if (seen.has(clean) || /thumb|preview|poster/i.test(u)) continue;
      seen.add(clean);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Video", link: u.replace(/&amp;/g, "&"), type: "movie" }] });
      if (links.length >= 5) break;
    }
    // Also check source tags
    $("video source, source[src]").each((_: any, el: any) => {
      let src = ($(el).attr("src") || "").trim();
      if (src.startsWith("//")) src = "https:" + src;
      if (src && !seen.has(src.split("?")[0])) {
        seen.add(src.split("?")[0]);
        links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Video", link: src, type: "movie" }] });
      }
    });
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
