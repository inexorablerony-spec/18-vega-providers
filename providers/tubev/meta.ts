import { Info, ProviderContext } from "../types";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html", Referer: "https://www.tubev.sex/" };
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: H, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    let image = $('meta[property="og:image"]').attr("content") || "";
    if (image.startsWith("//")) image = "https:" + image;
    const links: Info["linkList"] = [];
    const seen = new Set<string>();
    const re = /https?:\/\/[^"']+\/get_file\/[^"']+\.mp4[^"']*/gi;
    for (const m of html.matchAll(re)) {
      let u = m[0].replace(/&amp;/g, "&");
      if (seen.has(u.split("?")[0])) continue;
      seen.add(u.split("?")[0]);
      const q = (u.match(/_(\d{3,4})p/i) || [])[1];
      links.push({ title: q ? "Play (" + q + "p)" : "Play", quality: q ? q + "p" : undefined, directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    const vu = (html.match(/video_url:\s*['"]([^'"]+)/) || [])[1];
    if (vu && !seen.has(vu.split("?")[0])) {
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: vu.replace(/&amp;/g, "&"), type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
