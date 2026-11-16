import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://noodlemagazine.com/";
async function expandHls(url: string, axios: any): Promise<Stream[]> {
  const out: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  try {
    const res = await axios.get(url, { headers, timeout: 15000 });
    const text = res.data || "";
    if (!text.includes("#EXT-X-STREAM-INF")) {
      out.push({ server: "NT3 HLS", link: url, type: "m3u8", headers });
      return out;
    }
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith("#EXT-X-STREAM-INF")) continue;
      const m = lines[i].match(/RESOLUTION=(\d+)x(\d+)/i);
      const next = (lines[i + 1] || "").trim();
      if (!next || next.startsWith("#")) continue;
      const variant = next.startsWith("http") ? next : new URL(next, url).toString();
      const q = m ? m[2] + "p" : "auto";
      out.push({ server: `NT3 ${q}`, link: variant, type: "m3u8", headers });
    }
  } catch {}
  if (out.length === 0) out.push({ server: "NT3 HLS", link: url, type: "m3u8", headers });
  return out;
}
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  if (!/\.m3u8/i.test(link)) return [];
  const axios = providerContext?.axios;
  if (!axios) return [];
  return await expandHls(link, axios);
};
