import { Info, ProviderContext } from "../types";

const BASE = "https://sxyprn.com";

function ssut51(s: string): number {
  return [...s].reduce((sum, c) => (c >= "0" && c <= "9" ? sum + Number(c) : sum), 0);
}

function base64url(str: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  let i = 0;
  const bytes = new TextEncoder().encode(str);
  while (i < bytes.length) {
    const b1 = bytes[i++] || 0;
    const b2 = bytes[i++] || 0;
    const b3 = bytes[i++] || 0;
    const n = (b1 << 16) | (b2 << 8) | b3;
    out += chars[(n >> 18) & 63];
    out += chars[(n >> 12) & 63];
    out += i - 1 > bytes.length ? "=" : chars[(n >> 6) & 63];
    out += i > bytes.length ? "=" : chars[n & 63];
  }
  const pad = (3 - (bytes.length % 3)) % 3;
  if (pad) out = out.slice(0, -pad) + "=".repeat(pad);
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
}

function resolveUrl(src: string): string | null {
  if (!src.startsWith("/cdn/")) return null;
  const tmp = src.split("/");
  if (tmp.length < 8) return null;
  try {
    const s6 = ssut51(tmp[6]);
    const s7 = ssut51(tmp[7]);
    tmp[1] += "8/" + base64url(`${s6}-sxyprn.com-${s7}`);
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
    if (image.startsWith("//")) image = "https:" + image;

    const m = html.match(/data-vnfo='([^']+)'/);
    const directLinks: any[] = [];
    if (m) {
      try {
        const vnfo = JSON.parse(m[1]);
        for (const src of Object.values(vnfo || {})) {
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
