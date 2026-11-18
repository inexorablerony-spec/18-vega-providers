import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.alotporn.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    
    const linkList: any[] = [];
    const seen = new Set<string>();
    
    const mp4s = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
    for (const u of mp4s) {
      const clean = u.replace(/&amp;/g, "&");
      if (clean.includes("preview") || clean.includes("trailer")) continue;
      
      let quality = "HD";
      const qMatch = clean.match(/_(\d+p)\.mp4/i);
      if (qMatch) quality = qMatch[1];
      else if (clean.includes("_4k.mp4") || clean.includes("_2160p.mp4")) quality = "2160p";
      else if (!clean.match(/_\d+p\.mp4/)) quality = "720p";
      
      if (seen.has(quality)) continue;
      seen.add(quality);
      
      linkList.push({
        title: quality,
        quality: quality,
        directLinks: [{ title: quality, link: clean, type: "mp4" }]
      });
    }
    
    linkList.sort((a, b) => parseInt(b.quality) - parseInt(a.quality));
    
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
