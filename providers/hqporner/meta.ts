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
    // Find iframe (mydaddy.cc or similar)
    let iframe = $("iframe").first().attr("src") || "";
    if (iframe.startsWith("//")) iframe = "https:" + iframe;
    if (iframe) {
      try {
        const pr = await axios.get(iframe, { headers: { "User-Agent": UA, Referer: "https://hqporner.com/" }, timeout: 15000 });
        const ph = String(pr.data || "");
        // Extract video sources from player page
        const sources = ph.match(/https?:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/gi) || [];
        const seen = new Set<string>();
        for (const u of sources) {
          const clean = u.replace(/&amp;/g, "&").split("?")[0];
          if (seen.has(clean) || /preview|thumb|sprite|poster/i.test(u)) continue;
          seen.add(clean);
          links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Video", link: u.replace(/&amp;/g, "&"), type: "movie" }] });
          if (links.length >= 4) break;
        }
        // Also check for video_url style
        const vu = (ph.match(/video_url['"]?\s*[:=]\s*['"]([^'"]+)/) || [])[1];
        if (vu && !seen.has(vu.split("?")[0])) {
          links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Video", link: vu, type: "movie" }] });
        }
      } catch {}
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
