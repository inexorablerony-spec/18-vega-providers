import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const BASE = "https://sxyprn.com";
function ssut51(arg: string): number {
  const str = arg.replace(/[^0-9]/g, "");
  let sut = 0;
  for (let i = 0; i < str.length; i++) sut += parseInt(str.charAt(i), 10);
  return sut;
}
function btoaPure(str: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i = 0;
  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : 0;
    const c = i < str.length ? str.charCodeAt(i++) : 0;
    const triplet = (a << 16) | (b << 8) | c;
    result += chars[(triplet >> 18) & 63] + chars[(triplet >> 12) & 63];
    result += i > str.length + 1 ? "=" : chars[(triplet >> 6) & 63];
    result += i > str.length ? "=" : chars[triplet & 63];
  }
  return result;
}
function boo(ss: number, es: number): string {
  const b = btoaPure(ss + "-sxyprn.com-" + es);
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
}
function transformVid(path: string): string {
  const tmp = path.split("/");
  if (tmp.length < 8) return path;
  tmp[1] += "8/" + boo(ssut51(tmp[6]), ssut51(tmp[7]));
  tmp[5] = String(parseInt(tmp[5]) - ssut51(tmp[6]) - ssut51(tmp[7]));
  return tmp.join("/");
}
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "SxyPrn";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const linkList: any[] = [];
    const vnfoMatch = html.match(/data-vnfo=['"]([^'"]+)['"]/);
    if (vnfoMatch) {
      try {
        const data = JSON.parse(vnfoMatch[1].replace(/&quot;/g, '"'));
        for (const path of Object.values(data)) {
          if (typeof path !== "string") continue;
          const transformed = transformVid(path);
          let url = transformed.startsWith("/") ? BASE + transformed : transformed;
          linkList.push({ title: "Play", quality: "HD", directLinks: [{ title: "Play", link: url, type: "mp4" }] });
        }
      } catch {}
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
