import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://sxyprn.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    // Look for video sources in page
    const sources = html.match(/(https?:)?\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/gi) || [];
    const seen = new Set<string>();
    for (const u of sources) {
      let url = u.startsWith("//") ? "https:" + u : u;
      url = url.replace(/&amp;/g, "&");
      if (seen.has(url.split("?")[0]) || /preview|thumb|sprite|poster|vidthumb/i.test(url)) continue;
      seen.add(url.split("?")[0]);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Video", link: url, type: "movie" }] });
      if (links.length >= 3) break;
    }
    // Also check data-vnfo base64
    const vnfo = (html.match(/data-vnfo=["']([^"']+)/) || [])[1];
    if (vnfo && links.length === 0) {
      try {
        const decoded = Buffer.from(vnfo, "base64").toString("utf8");
        const m = decoded.match(/(https?:)?\/\/[^"'\s]+/);
        if (m) {
          let url = m[0].startsWith("//") ? "https:" + m[0] : m[0];
          links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Video", link: url, type: "movie" }] });
        }
      } catch {}
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
