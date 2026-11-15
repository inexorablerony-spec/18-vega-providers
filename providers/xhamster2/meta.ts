import { Info, ProviderContext } from "../types";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://xhamster.com/", Accept: "text/html" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim() || $("title").text().trim() || "XHamster";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    const seen = new Set<string>();
    $("video source, video").each((_: any, el: any) => {
      const src = $(el).attr("src") || $(el).attr("data-src") || "";
      if (src && (src.includes(".mp4") || src.includes(".m3u8"))) {
        let url = src.startsWith("//") ? "https:" + src : src;
        if (!seen.has(url)) { seen.add(url); links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] }); }
      }
    });
    $('script[type="application/ld+json"]').each((_: any, el: any) => {
      try {
        const data = JSON.parse($(el).html() || "{}");
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item.contentUrl && (item.contentUrl.includes(".mp4") || item.contentUrl.includes(".m3u8"))) {
            if (!seen.has(item.contentUrl)) { seen.add(item.contentUrl); links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: item.contentUrl, type: "movie" }] }); }
          }
        }
      } catch {}
    });
    const mp4s = html.match(/https?:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/gi) || [];
    for (const u of mp4s) {
      if (seen.has(u) || /thumb|preview|sprite/i.test(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
