import { Info, ProviderContext } from "../types";

function unpack(html: string): string {
  const idx = html.indexOf("function(p,a,c,k,e,d)");
  if (idx < 0) return "";
  const start = html.indexOf("}('", idx);
  const end = html.indexOf(".split('|')", start);
  if (start < 0 || end < 0) return "";
  const chunk = html.slice(start + 3, end);
  const m = chunk.match(/',(\d+),(\d+),'/);
  if (!m) return "";
  let p = chunk.slice(0, m.index);
  const a = parseInt(m[1], 10);
  const c = parseInt(m[2], 10);
  const k = chunk.slice(m.index! + m[0].length).split("|");
  const toBase = (n: number, base: number): string => {
    if (n === 0) return "0";
    const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "";
    while (n) { result = digits[n % base] + result; n = Math.floor(n / base); }
    return result;
  };
  for (let i = Math.min(c, k.length) - 1; i >= 0; i--) {
    if (k[i]) p = p.replace(new RegExp("\\b" + toBase(i, a) + "\\b", "g"), k[i]);
  }
  return p;
}

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://latestpornvideo.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const directLinks: any[] = [];
    const iframe = html.match(/iframe[^>]+src=["']([^"']+)["']/i)?.[1] || "";
    if (iframe) {
      const embed = await axios.get(iframe, { headers: { "User-Agent": "Mozilla/5.0", Referer: link }, timeout: 15000 });
      const unpacked = unpack(String(embed.data || ""));
      const m3u8 = unpacked.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i)?.[0];
      if (m3u8) directLinks.push({ title: "HLS", link: m3u8, type: "m3u8" });
    }
    if (directLinks.length === 0) directLinks.push({ title: "Play", link, type: "mp4" });
    const linkList = [{ title: "Play", quality: "HLS", directLinks }];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
