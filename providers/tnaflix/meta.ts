import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.tnaflix.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    
    const directLinks: any[] = [];
    const seen = new Set<string>();
    
    const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const u of mp4s) {
      const clean = u.replace(/&amp;/g, "&");
      if (clean.includes("preview") || clean.includes("thumb")) continue;
      
      const qMatch = clean.match(/-(\d+p)\.mp4/i);
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
  } catch { return empty; }
};
