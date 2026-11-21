import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.porntrex.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const directLinks: any[] = [];
    const seen = new Set<string>();
    const mp4s = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
    for (const u of mp4s) {
      const clean = u.replace(/&amp;/g, "&");
      if (/trailer|preview|sprite/i.test(clean) || seen.has(clean)) continue;
      seen.add(clean);
      const q = clean.match(/_(\d+p)\.mp4/i)?.[1] || "HD";
      directLinks.push({ title: q, link: clean, type: "mp4" });
    }
    const linkList = directLinks.length ? [{ title: "Play", quality: directLinks[0]?.title || "HD", directLinks }] : [];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
