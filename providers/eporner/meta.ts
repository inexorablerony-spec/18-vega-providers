import { Info, ProviderContext } from "../types";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://www.eporner.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    const seen = new Set<string>();
    // 1. Extract contentUrl from JSON-LD
    const contentUrl = (html.match(/"contentUrl":\s*"([^"]+\.mp4)"/) || [])[1];
    if (contentUrl && !seen.has(contentUrl)) {
      seen.add(contentUrl);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: contentUrl, type: "movie" }] });
    }
    // 2. Extract from data-vid attribute and construct gvideo URL
    const dataVid = $('video').attr("data-vid") || "";
    if (dataVid && dataVid.includes(".mp4")) {
      const gvideoUrl = "https://gvideo.eporner.com/" + dataVid;
      if (!seen.has(gvideoUrl)) {
        seen.add(gvideoUrl);
        links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: gvideoUrl, type: "movie" }] });
      }
    }
    // 3. Extract any gvideo.eporner.com URLs
    const gvideo = html.match(/https?:\/\/gvideo\.eporner\.com\/[^"'\s]+\.mp4/gi) || [];
    for (const u of gvideo) {
      if (seen.has(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    // 4. Fallback: any .mp4 URL that isn't a thumbnail
    const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4/gi) || [];
    for (const u of mp4s) {
      if (seen.has(u) || /thumb|preview|sprite|static/i.test(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
