import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
function absoluteUrl(value: string, base: string): string {
  try { return new URL(value.replace(/\\\//g, "/").replace(/&amp;/g, "&"), base).toString(); } catch { return ""; }
}
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const response = await axios.get(link, { headers: { "User-Agent": UA, "Referer": "https://xhamster.com/", "Accept": "text/html,application/xhtml+xml" }, timeout: 20000 });
    const html = String(response.data || "");
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim() || $("title").text().trim();
    const image = absoluteUrl($('meta[property="og:image"]').attr("content") || "", link);
    const synopsis = $('meta[name="description"]').attr("content") || "";
    const sources = new Map<string, string>();
    $("video source, video").each((_: any, element: any) => {
      const el = $(element);
      const raw = el.attr("src") || el.attr("data-src") || "";
      const url = absoluteUrl(raw, link);
      if (url && /\.(mp4|m3u8)(?:$|[?#])/i.test(url)) sources.set(url, url);
    });
    $('script[type="application/ld+json"]').each((_: any, element: any) => {
      try {
        const json = JSON.parse($(element).html() || "{}");
        const items = Array.isArray(json) ? json : [json];
        for (const item of items) {
          const contentUrl = item.contentUrl || item.embedUrl || "";
          if (contentUrl) {
            const url = absoluteUrl(contentUrl, link);
            if (url && /\.(mp4|m3u8)(?:$|[?#])/i.test(url)) sources.set(url, url);
          }
        }
      } catch {}
    });
    const linkList: Info["linkList"] = [];
    for (const [url] of sources) {
      const isHls = /\.m3u8(?:$|[?#])/i.test(url);
      linkList.push({ title: isHls ? "HLS" : "MP4", quality: "auto", directLinks: [{ title: isHls ? "HLS" : "MP4", link: url, type: isHls ? "hls" : "movie" }] });
    }
    return { title: title || "XHamster Video", synopsis, image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
