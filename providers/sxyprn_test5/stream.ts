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
function boo(ss: number, es: number): string {
  const b = btoa(ss + "-sxyprn.com-" + es);
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
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
  const seen = new Set<string>();
  const headers = { "User-Agent": UA, Referer: REFERER };
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const vnfoMatch = html.match(/data-vnfo=['"]([^'"]+)['"]/);
    if (vnfoMatch) {
      try {
        const data = JSON.parse(vnfoMatch[1].replace(/&quot;/g, '"'));
        for (const path of Object.values(data)) {
          if (typeof path !== "string") continue;
          const transformed = transformVid(path);
          let url = transformed.startsWith("/") ? BASE + transformed : transformed;
          if (!seen.has(url)) { seen.add(url); streams.push({ server: "SP5 VNFO", link: url, type: "mp4", headers }); }
        }
      } catch {}
    }
  } catch {}
  return streams;
};
