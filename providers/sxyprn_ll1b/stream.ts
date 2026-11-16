import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://sxyprn.com/";
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
  return btoaPure(ss + "-sxyprn.com-" + es).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
}
function transformVid(path: string): string {
  const tmp = path.split("/");
  if (tmp.length < 8) return path;
  tmp[1] += "8/" + boo(ssut51(tmp[6]), ssut51(tmp[7]));
  tmp[5] = String(parseInt(tmp[5]) - ssut51(tmp[6]) - ssut51(tmp[7]));
  return tmp.join("/");
}
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const vnfoMatch = html.match(/data-vnfo=['"]([^'"]+)['"]/);
    if (vnfoMatch) {
      try {
        const data = JSON.parse(vnfoMatch[1].replace(/&quot;/g, '"'));
        for (const path of Object.values(data)) {
          if (typeof path !== "string") continue;
          const transformed = transformVid(path);
          let url = transformed.startsWith("/") ? BASE + transformed : transformed;
          const redir = await axios.get(url, { headers: { "User-Agent": UA, Referer: REFERER }, maxRedirects: 0, validateStatus: (s: number) => s < 400, timeout: 10000 });
          const location = redir.headers?.location || "";
          const finalUrl = location.startsWith("//") ? "https:" + location : location || url;
          streams.push({ server: "LL1b", link: finalUrl, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
        }
      } catch {}
    }
  } catch {}
  return streams;
};
