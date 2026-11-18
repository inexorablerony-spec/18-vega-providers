import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ 
  link, 
  providerContext 
}: { 
  link: string; 
  providerContext: ProviderContext 
}): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { 
      headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.wankoz.com/" }, 
      timeout: 20000 
    });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const directLinks: any[] = [];
    const seen = new Set<string>();

    // Extract video_url with quality
    const videoUrl = html.match(/video_url:\s*'([^']+)'/)?.[1];
    const videoQuality = html.match(/video_url_text:\s*'(\d+p)'/)?.[1] || "720p";
    
    if (videoUrl && !videoUrl.includes("preview") && !seen.has(videoQuality)) {
      seen.add(videoQuality);
      directLinks.push({
        title: videoQuality,
        link: videoUrl.replace(/&amp;/g, "&"),
        type: "mp4"
      });
    }

    // Extract video_alt_url with quality (usually higher)
    const altUrl = html.match(/video_alt_url:\s*'([^']+)'/)?.[1];
    const altQuality = html.match(/video_alt_url_text:\s*'(\d+p)'/)?.[1] || "1080p";
    
    if (altUrl && !altUrl.includes("preview") && !seen.has(altQuality)) {
      seen.add(altQuality);
      directLinks.push({
        title: altQuality,
        link: altUrl.replace(/&amp;/g, "&"),
        type: "mp4"
      });
    }

    // Fallback: extract from get_file URLs
    if (directLinks.length === 0) {
      const gf = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
      for (const u of gf) {
        const clean = u.replace(/&amp;/g, "&");
        if (clean.includes("preview") || seen.has(clean)) continue;
        seen.add(clean);
        
        // Guess quality from suffix
        let quality = "HD";
        if (clean.includes("_a.mp4")) quality = "1080p";
        else if (clean.includes("_s.mp4")) quality = "720p";
        
        directLinks.push({ title: quality, link: clean, type: "mp4" });
      }
    }

    const linkList: any[] = [];
    if (directLinks.length > 0) {
      directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
      linkList.push({
        title: "Play",
        quality: directLinks[0]?.title || "HD",
        directLinks
      });
    }

    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { 
    return empty; 
  }
};
