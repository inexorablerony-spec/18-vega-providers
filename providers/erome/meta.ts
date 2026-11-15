import { Info, ProviderContext } from "../types";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://www.erome.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || "Erome Album";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    const seen = new Set<string>();
    $("video").each((_: any, el: any) => {
      const video = $(el);
      const candidates = [video.attr("src"), video.attr("data-src"), video.find("source").attr("src"), video.find("source").attr("data-src")];
      for (const candidate of candidates) {
        if (!candidate) continue;
        let url = candidate.replace(/&amp;/g, "&").trim();
        if (url.startsWith("//")) url = "https:" + url;
        if (url.startsWith("/")) url = "https://www.erome.com" + url;
        if (!/^https?:\/\//i.test(url) || !/\.mp4(?:$|[?#])/i.test(url) || seen.has(url)) continue;
        seen.add(url);
        links.push({ title: `Play ${links.length + 1}`, quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] });
      }
    });
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
