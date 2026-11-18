import { Info, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

export const getMeta = async function ({ 
  link, 
  providerContext 
}: { 
  link: string; 
  providerContext: ProviderContext 
}): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
    const html = res.data || "";
    
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.replace(/\s*-\s*Porn4Fans.*$/i, "").trim() || "Porn4Fans";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";

    const linkList: any[] = [];
    const directLinks: any[] = [];
    const seen = new Set<string>();

    // Extract MP4 URLs with quality from filename
    const mp4Match = html.match(/https?:\/\/[^"'\s]+get_file[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    
    for (const url of mp4Match) {
      if (url.includes("preview")) continue;
      
      // Extract quality from URL (e.g., _720p.mp4, _1080p.mp4)
      const qualityMatch = url.match(/_(\d+p)\.mp4/i);
      const quality = qualityMatch ? qualityMatch[1] : "480p";
      
      // Deduplicate by quality
      if (seen.has(quality)) continue;
      seen.add(quality);

      directLinks.push({
        title: quality,
        link: url,
        type: "mp4"
      });
    }

    // Also check video_url_text for default quality
    const defaultQuality = html.match(/video_url_text:\s*'(\d+p)'/)?.[1];
    const defaultUrl = html.match(/video_url:\s*'(https?:\/\/[^']+)'/)?.[1];
    
    if (defaultUrl && defaultQuality && !seen.has(defaultQuality) && !defaultUrl.includes("preview")) {
      directLinks.push({
        title: defaultQuality,
        link: defaultUrl,
        type: "mp4"
      });
    }

    if (directLinks.length > 0) {
      // Sort by quality descending
      directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
      linkList.push({
        title: "Play",
        quality: directLinks[0]?.title || "HD",
        directLinks
      });
    }

    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
