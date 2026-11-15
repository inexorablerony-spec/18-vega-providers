import { Info, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function getVideoId(link: string): string {
  const patterns = [
    /\/embed\/([a-z0-9]+)/i,
    /\/video-([a-z0-9]+)/i,
    /\/hd-porn\/([a-z0-9]+)/i,
  ];
  for (const pattern of patterns) {
    const match = link.match(pattern);
    if (match) return match[1];
  }
  return "";
}

function toBase36(num: number): string {
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  if (num === 0) return "0";
  let result = "";
  while (num > 0) {
    result = digits[num % 36] + result;
    num = Math.floor(num / 36);
  }
  return result;
}

function convertPlayerHash(hash: string): string {
  const chunks = hash.match(/[a-f0-9]{8}/gi) || [];
  return chunks.map((chunk) => toBase36(parseInt(chunk, 16))).join("");
}

function cleanUrl(value: string): string {
  return value.replace(/\\\//g, "/").replace(/&amp;/g, "&").trim();
}

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const empty: Info = {
    title: "",
    synopsis: "",
    image: "",
    imdbId: "",
    type: "movie",
    linkList: [],
  };

  try {
    const { axios, cheerio } = providerContext;
    const id = getVideoId(link);
    if (!id) return empty;

    const embedUrl = `https://www.eporner.com/embed/${id}`;

    const page = await axios.get(embedUrl, {
      headers: {
        "User-Agent": UA,
        Referer: "https://www.eporner.com/",
        Accept: "text/html,application/xhtml+xml",
      },
      timeout: 20000,
    });

    const html = String(page.data || "");
    const $ = cheerio.load(html);

    const title = $("h1").first().text().trim() || $("title").text().trim() || "Eporner video";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const hashMatch = html.match(/EP\.video\.player\.hash\s*=\s*['"]([a-f0-9]+)['"]/i);
    if (!hashMatch) {
      return { ...empty, title, image };
    }

    const hash = convertPlayerHash(hashMatch[1]);
    if (!hash) {
      return { ...empty, title, image };
    }

    const setCookie = page.headers?.["set-cookie"];
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.map((cookie: string) => cookie.split(";")[0]).join("; ")
      : "";

    const params = {
      hash,
      domain: "www.eporner.com",
      pixelRatio: 1.5,
      playerWidth: 0,
      playerHeight: 0,
      fallback: false,
      embed: true,
      supportedFormats: "hls,dash,mp4",
      _: `${Math.floor(Date.now() / 1000)}${Math.floor(100 + Math.random() * 900)}`,
    };

    const sourceResponse = await axios.get(
      `https://www.eporner.com/xhr/video/${id}`,
      {
        params,
        headers: {
          "User-Agent": UA,
          Referer: embedUrl,
          Origin: "https://www.eporner.com",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json, text/javascript, */*",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        timeout: 20000,
      }
    );

    let data = sourceResponse.data;
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    const mp4Sources = data?.sources?.mp4;
    if (!mp4Sources) {
      return { ...empty, title, image };
    }

    const entries = Array.isArray(mp4Sources)
      ? mp4Sources.map((item: any, index: number) => [item.quality || item.label || `Quality ${index + 1}`, item])
      : Object.entries(mp4Sources);

    const seen = new Set<string>();
    const linkList: Info["linkList"] = [];

    for (const [qualityValue, sourceValue] of entries as [string, any][]) {
      const rawUrl = typeof sourceValue === "string" ? sourceValue : sourceValue?.src || sourceValue?.url || "";
      const mediaUrl = cleanUrl(rawUrl);

      if (!/^https?:\/\//i.test(mediaUrl) || !/\.mp4(?:$|[?#])/i.test(mediaUrl) || seen.has(mediaUrl)) {
        continue;
      }

      seen.add(mediaUrl);
      const quality = String(qualityValue).match(/\d+/) ? `${String(qualityValue).match(/\d+/)?.[0]}p` : String(qualityValue);

      linkList.push({
        title: `Play (${quality})`,
        quality,
        directLinks: [{ title: "MP4", link: mediaUrl, type: "movie" }],
      });
    }

    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch (error) {
    return empty;
  }
};
