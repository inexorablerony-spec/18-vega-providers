import { Info, ProviderContext } from "../types";

const BASE = "https://sxyprn.com";

function ssut51(s: string): number {
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 48 && c <= 57) sum += c - 48;
  }
  return sum;
}

function base64url(str: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i));
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i] || 0;
    const b2 = bytes[i + 1] || 0;
    const b3 = bytes[i + 2] || 0;
    const n = (b1 << 16) | (b2 << 8) | b3;
    out += chars[(n >> 18) & 63];
    out += chars[(n >> 12) & 63];
    out += i + 1 < bytes.length ? chars[(n >> 6) & 63] : "=";
    out += i + 2 < bytes.length ? chars[n & 63] : "=";
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
}

function resolveUrl(src: string): string | null {
  if (!src || src.indexOf("/cdn/") !== 0) return null;
  const tmp = src.split("/");
  if (tmp.length < 8) return null;
  try {
    const s6 = ssut51(tmp[6]);
    const s7 = ssut51(tmp[7]);
    tmp[1] += "8/" + base64url(s6 + "-sxyprn.com-" + s7);
    tmp[5] = String(Number(tmp[5]) - s6 - s7);
    return BASE + tmp.join("/");
  } catch {
    return null;
  }
}

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, {
      headers: { "User-Agent": "Mozilla/5.0", Referer: BASE + "/" },
      timeout: 20000,
    });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("title").text().replace(/ on the SexyPorn.*/i, "").replace(/ - sxyprn.*/i, "").trim() || "Untitled";
    let image = $('meta[property="og:image"]').attr("content") || $("img[data-src]").first().attr("data-src") || "";
    if (image.indexOf("//") === 0) image = "https:" + image;

    const m = html.match(/data-vnfo='([^']+)'/);
    const directLinks: any[] = [];
    if (m) {
      try {
        const vnfo = JSON.parse(m[1]);
        const keys = Object.keys(vnfo || {});
        for (let k = 0; k < keys.length; k++) {
          const src = vnfo[keys[k]];
          if (typeof src !== "string") continue;
          const url = resolveUrl(src);
          if (url) directLinks.push({ title: "HD", link: url, type: "mp4" });
        }
      } catch {}
    }

    const linkList = directLinks.length
      ? [{ title: "Play", quality: "HD", directLinks }]
      : [];

    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return empty;
  }
};
