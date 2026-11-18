import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.replace(/\s*-\s*FapGoat.*$/i, "").trim() || "FapGoat";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    
    const directLinks: any[] = [];
    const seen = new Set<string>();
    
    const mp4s = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
    for (const u of mp4s) {
      const clean = u.replace(/&amp;/g, "&");
      if (clean.includes("preview") || clean.includes("trailer")) continue;
      
      const qMatch = clean.match(/_(\d+p)\.mp4/i);
      const quality = qMatch ? qMatch[1] : "HD";
      
      if (seen.has(quality)) continue;
      seen.add(quality);
      
      directLinks.push({ title: quality, link: clean, type: "mp4" });
    }
    
    directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
    
    const linkList: any[] = [];
    if (directLinks.length > 0) {
      linkList.push({ title: "Play", quality: directLinks[0]?.title || "HD", directLinks });
    }
    
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
