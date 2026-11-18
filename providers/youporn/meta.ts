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
    const res = await axios.get(link, { 
      headers: { "User-Agent": UA }, 
      timeout: 15000 
    });
    const html = res.data || "";

    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.replace(/\s*-\s*YouPorn.*$/i, "").trim() || "YouPorn";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";

    const linkList: any[] = [];

    const mediaMatch = html.match(/mediaDefinitions"\s*:\s*(\[[^\]]+\])/);
    if (mediaMatch) {
      try {
        const definitions = JSON.parse(mediaMatch[1].replace(/\\/g, ""));
        const directLinks: any[] = [];
        
        for (const def of definitions) {
          if (def.videoUrl) {
            const type = def.format === "hls" ? "m3u8" : "mp4";
            const label = def.format === "hls" ? "HLS" : "MP4";
            directLinks.push({
              title: label,
              link: def.videoUrl,
              type
            });
          }
        }

        if (directLinks.length > 0) {
          linkList.push({
            title: "Play",
            quality: "Auto",
            directLinks
          });
        }
      } catch {}
    }

    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
