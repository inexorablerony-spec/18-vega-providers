import { Info, ProviderContext } from "../types";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://hqporner.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    const seen = new Set<string>();
    // Extract mydaddy iframe
    let iframe = $('iframe[src*="mydaddy"]').attr("src") || "";
    if (!iframe) iframe = (html.match(/src="(\/\/mydaddy[^"]+)"/) || [])[1] || "";
    if (iframe) {
      const iframeUrl = iframe.startsWith("//") ? "https:" + iframe : iframe;
      try {
        const iframeRes = await axios.get(iframeUrl, { headers: { "User-Agent": "Mozilla/5.0", Referer: link }, timeout: 15000 });
        const iframeHtml = String(iframeRes.data || "");
        // Extract tops.mydaddy.cc or bigcdn.cc MP4s
        const mp4s = iframeHtml.match(/\/\/[^"'\s]+\.mp4/gi) || [];
        for (const u of mp4s) {
          const full = "https:" + u.replace(/\\/g, "").replace(/&amp;/g, "&");
          if (seen.has(full) || /thumb|preview|tile|main\.jpg/i.test(full)) continue;
          seen.add(full);
          const quality = full.includes("/1080") ? "1080p" : full.includes("/720") ? "720p" : full.includes("/360") ? "360p" : "auto";
          links.push({ title: "Play (" + quality + ")", quality: quality, directLinks: [{ title: "MP4", link: full, type: "movie" }] });
        }
      } catch (e) {
        // Log but don't fail silently - return what we have
      }
    }
    // Fallback: protocol-relative from main page
    const proto = html.match(/\/\/[^"'\s]+\.mp4/gi) || [];
    for (const u of proto) {
      const full = "https:" + u.replace(/&amp;/g, "&");
      if (seen.has(full) || /thumb|preview/i.test(full)) continue;
      seen.add(full);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: full, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
