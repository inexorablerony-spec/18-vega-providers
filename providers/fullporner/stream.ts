import { Stream, ProviderContext } from "../types";

const QUALITY: Record<number, string> = { 1: "360", 2: "480", 4: "720", 8: "1080" };

async function resolve(link: string, axios: any): Promise<string> {
  if (link.includes("xiaoshenke.net") && !link.includes("/s0/")) {
    try {
      const res = await axios.get(link, {
        headers: { "User-Agent": "Mozilla/5.0", Referer: "https://fullporner.com/" },
        maxRedirects: 0,
        validateStatus: (s: number) => s < 400,
        timeout: 10000,
      });
      const loc = res.headers?.location || "";
      if (loc.startsWith("//")) return "https:" + loc;
      if (loc.startsWith("/")) return "https://xiaoshenke.net" + loc;
      if (loc) return loc;
    } catch {}
  }
  if (link.includes("/watch/")) {
    try {
      const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 });
      const html = String(res.data || "");
      const iframe = html.match(/iframe[^>]+src=["']([^"']+)["']/i)?.[1] || "";
      const m = iframe.match(/\/(?:video|player)\/([a-z0-9]+)\/(\d+)/i);
      if (m) {
        const mediaId = m[1].split("").reverse().join("");
        const mask = parseInt(m[2], 10);
        for (const bit of [8, 4, 2, 1]) {
          if (mask & bit) {
            const raw = `https://xiaoshenke.net/vid/${mediaId}/${QUALITY[bit]}`;
            return await resolve(raw, axios);
          }
        }
      }
    } catch {}
  }
  return link;
}

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const axios = providerContext?.axios;
  const final = axios ? await resolve(link, axios) : link;
  return [{ server: "FullPorner", link: final, type: "mp4", headers: { Referer: "https://fullporner.com/", "User-Agent": "Mozilla/5.0" } }];
};
