import { Info, ProviderContext } from "../types";

function digitSum(value: string): number {
  const digits = value.replace(/[^0-9]/g, "");
  return digits.split("").reduce((sum, digit) => sum + Number(digit), 0);
}

function resolveVideoUrl(rawPath: string): string {
  const parts = rawPath.split("/");
  if (parts.length < 8) return "";

  const host = "sxyprn.net";
  const sum6 = digitSum(parts[6]);
  const sum7 = digitSum(parts[7]);

  const token = Buffer.from(`${sum6}-${host}-${sum7}`).toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, ".");

  parts[1] += `5/${token}`;
  const offset = Number(parts[5]);
  if (!Number.isFinite(offset)) return "";

  parts[5] = String(offset - sum6 - sum7);
  return `https://${host}${parts.join("/")}`;
}

export const getMeta = async function ({
  link,
  providerContext
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
    linkList: []
  };

  try {
    const { axios, cheerio } = providerContext;

    const res = await axios.get(link, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://sxyprn.com/"
      },
      timeout: 20000
    });

    const html = String(res.data || "");
    const $ = cheerio.load(html);

    const title =
      $(".PostEditTA").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      $("title").text().trim() ||
      "SxyPrn Video";

    const image =
      $('meta[property="og:image"]').attr("content") || "";

    const match = new URL(link).pathname.match(/\/post\/([^/.]+)/i);
    const activeId = match ? match[1] : "";

    let rawPath = "";

    $(".vidsnfo[data-vnfo]").each((_: any, el: any) => {
      if (rawPath) return;
      const raw = $(el).attr("data-vnfo");
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        if (activeId && data[activeId]) {
          rawPath = data[activeId];
        } else {
          const ids = Object.keys(data);
          if (ids.length) rawPath = data[ids[0]];
        }
      } catch {}
    });

    let videoUrl = rawPath ? resolveVideoUrl(rawPath) : "";

    if (!videoUrl) {
      const player = $("#player_el, video.player_el").first();
      const direct = player.attr("data-puri") || player.attr("src") || player.find("source").first().attr("src") || "";
      if (direct) {
        videoUrl = new URL(direct, link).toString();
      }
    }

    const valid = /^https?:\/\//i.test(videoUrl) && (/\.(?:mp4|vid)(?:$|[?#])/i.test(videoUrl) || /^https?:\/\/[^/]+\/(?:cdn5?|vidi)\//i.test(videoUrl));

    if (!valid) {
      return { ...empty, title, image };
    }

    return {
      title,
      synopsis: "",
      image,
      imdbId: "",
      type: "movie",
      linkList: [{
        title: "Play",
        quality: "auto",
        directLinks: [{
          title: "MP4",
          link: videoUrl,
          type: "movie"
        }]
      }]
    };
  } catch {
    return empty;
  }
};
