import { Info, ProviderContext } from "../types";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "YouJizz";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const fullImage = image.startsWith("//") ? "https:" + image : image;
    const linkList: any[] = [];
    const mp4Match = html.match(/\/\/cdne-mobile\.youjizz\.com[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    const qualities: Record<string, string> = {};
    for (const url of [...new Set(mp4Match)] as string[]) {
      const fullUrl = url.startsWith("//") ? "https:" + url : url;
      const resMatch = url.match(/(\d+)-(\d+)-(\d+)-h264/);
      if (resMatch) {
        const height = parseInt(resMatch[2]);
        let quality = "SD";
        if (height >= 1080) quality = "1080p";
        else if (height >= 720) quality = "720p";
        else if (height >= 480) quality = "480p";
        else if (height >= 360) quality = "360p";
        else if (height >= 240) quality = "240p";
        else quality = "144p";
        if (!qualities[quality]) qualities[quality] = fullUrl;
      }
    }
    for (const [quality, url] of Object.entries(qualities)) {
      linkList.push({ title: "Play", quality, directLinks: [{ title: quality, link: url, type: "mp4" }] });
    }
    return { title, synopsis: "", image: fullImage, imdbId: "", type: "movie", linkList };
  } catch { return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] }; }
};
