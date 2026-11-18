import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.perfectgirls.net/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    
    const directLinks: any[] = [];
    const seen = new Set<string>();
    
    const videoUrl = html.match(/video_url:\s*'([^']+)'/)?.[1];
    const videoQuality = html.match(/video_url_text:\s*'([^']+)'/)?.[1] || "HD";
    
    if (videoUrl && !videoUrl.includes("preview")) {
      seen.add(videoQuality);
      directLinks.push({ title: videoQuality, link: videoUrl.replace(/&amp;/g, "&"), type: "mp4" });
    }
    
    if (directLinks.length === 0) {
      const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
      for (const u of mp4s.slice(0, 3)) {
        const clean = u.replace(/&amp;/g, "&");
        if (clean.includes("preview") || clean.includes("thumb") || seen.has(clean)) continue;
        seen.add(clean);
        const qMatch = clean.match(/_(\d+p)\.mp4/i);
        directLinks.push({ title: qMatch ? qMatch[1] : "HD", link: clean, type: "mp4" });
      }
    }
    
    const linkList: any[] = [];
    if (directLinks.length > 0) {
      linkList.push({ title: "Play", quality: directLinks[0]?.title || "HD", directLinks });
    }
    
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
