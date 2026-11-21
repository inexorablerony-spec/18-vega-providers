import { Stream, ProviderContext } from "../types";

const BASE = "https://sxyprn.com";

function ssut51(s: string): number {
  return [...s].reduce((sum, c) => (c >= "0" && c <= "9" ? sum + Number(c) : sum), 0);
}

function boo(ss: number, es: number): string {
  const raw = `${ss}-sxyprn.com-${es}`;
  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, ".");
}

export const getStream = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext?: ProviderContext;
}): Promise<Stream[]> {
  if (!link) return [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];

    const res = await axios.get(link, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: BASE + "/",
      },
      timeout: 20000,
    });
    const html = String(res.data || "");

    const m = html.match(/data-vnfo='([^']+)'/);
    if (!m) return [];

    let vnfo: any;
    try {
      vnfo = JSON.parse(m[1]);
    } catch {
      return [];
    }
    if (!vnfo || typeof vnfo !== "object") return [];

    const streams: Stream[] = [];
    for (const src of Object.values(vnfo)) {
      if (typeof src !== "string" || !src.startsWith("/cdn/")) continue;
      const tmp = src.split("/");
      if (tmp.length < 8) continue;
      try {
        const s6 = ssut51(tmp[6]);
        const s7 = ssut51(tmp[7]);
        tmp[1] += "8/" + boo(s6, s7);
        tmp[5] = String(Number(tmp[5]) - s6 - s7);
        const finalUrl = BASE + tmp.join("/");
        streams.push({
          server: "SxyPrn",
          link: finalUrl,
          type: "mp4",
          headers: { Referer: BASE + "/", "User-Agent": "Mozilla/5.0" },
        });
      } catch {
        continue;
      }
    }
    return streams;
  } catch {
    return [];
  }
};
