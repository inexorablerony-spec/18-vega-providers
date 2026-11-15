import { Info, ProviderContext } from "../types";

function digitSum(value: string): number {
  return (String(value).match(/[0-9]/g) || [])
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function resolveVideoUrl(rawPath: string): string {
  const parts = String(rawPath).split("/");
  if (parts.length < 8) return "";

  const host = "sxyprn.net";
  const sum6 = digitSum(parts[6]);
  const sum7 = digitSum(parts[7]);

  const token = Buffer.from(
    `${sum6}-${host}-${sum7}`,
    "utf8"
  ).toString("base64")
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
      $('meta[property="og:title"]').attr("content") ||
      $("title").text().trim() ||
      "SxyPrn Video";

    const image =
      $('meta[property="og:image"]').attr("content") || "";

    const player = $("#player_el").first();
    const activeId =
      player.attr("data-postid") ||
      new URL(link).pathname.match(/\/post\/([^/.]+)/i)?.[1] ||
      "";

    const maps: Record<string, string>[] = [];

    $(".vidsnfo[data-vnfo]").each((_: any, el: any) => {
      try {
        const raw = $(el).attr("data-vnfo");
        if (!raw) return;

        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          maps.push(parsed);
        }
      } catch {}
    });

    let rawPath = "";

    if (activeId) {
      for (const map of maps) {
        if (map[activeId]) {
          rawPath = map[activeId];
          break;
        }
      }
    }

    if (!rawPath && maps.length > 0) {
      const firstMap = maps[0];
      const firstId = Object.keys(firstMap)[0];

      if (firstId) {
        rawPath = firstMap[firstId];
      }
    }

    if (!rawPath) {
      return { ...empty, title, image };
    }

    const videoUrl = resolveVideoUrl(rawPath);

    if (!videoUrl || !/^https:\/\//i.test(videoUrl)) {
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
