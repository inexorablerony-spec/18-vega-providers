import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://hqporner.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    let iframe = $("iframe").first().attr("src") || "";
    if (iframe.startsWith("//")) iframe = "https:" + iframe;
    if (iframe) {
      try {
        const pr = await axios.get(iframe, { headers: { "User-Agent": UA, Referer: "https://hqporner.com/" }, timeout: 15000 });
        const ph = String(pr.data || "");
        // Extract protocol-relative and absolute mp4 from bigcdn
        const raw = ph.match(/\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
        const seen = new Set<string>();
        for (const u of raw) {
          let url = u.startsWith("//") ? "https:" + u : u;
          url = url.replace(/&amp;/g, "&");
          const clean = url.split("?")[0];
          if (seen.has(clean) || /preview|thumb|sprite|poster/i.test(url)) continue;
          seen.add(clean);
          const q = (url.match(/\/(\d{3,4})\.mp4/i) || [])[1];
          links.push({ title: q ? "Play (" + q + "p)" : "Play", quality: q ? q + "p" : "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] });
        }
      } catch {}
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
