import { Info, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://www.youporn.com/";

export const getMeta = async function ({ 
  link, 
  providerContext 
}: { 
  link: string; 
  providerContext: ProviderContext 
}): Promise<Info> {
  try {
    const { axios } = providerContext;
    const headers = { "User-Agent": UA, Referer: REFERER };
    const res = await axios.get(link, { headers, timeout: 15000 });
    const html = res.data || "";

    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.replace(/\s*-\s*YouPorn.*$/i, "").trim() || "YouPorn";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";

    const linkList: any[] = [];
    const directLinks: any[] = [];

    const mediaMatch = html.match(/mediaDefinitions"\s*:\s*(\[[^\]]+\])/);
    if (mediaMatch) {
      try {
        const definitions = JSON.parse(mediaMatch[1].replace(/\\/g, ""));
        
        for (const def of definitions) {
          if (def.format === "hls" && def.videoUrl) {
            const hlsRes = await axios.get(def.videoUrl, { headers, timeout: 15000 });
            const variants = Array.isArray(hlsRes.data) ? hlsRes.data : [];
            
            for (const v of variants) {
              if (v.videoUrl && v.quality) {
                directLinks.push({
                  title: `${v.quality}p`,
                  link: v.videoUrl,
                  type: "m3u8"
                });
              }
            }
          }
        }
      } catch {}
    }

    if (directLinks.length > 0) {
      directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
      linkList.push({
        title: "Play",
        quality: directLinks[0]?.title || "Auto",
        directLinks
      });
    }

    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
