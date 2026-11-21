import { Info, ProviderContext } from "../types";

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
      headers: { "User-Agent": "Mozilla/5.0", Referer: "https://sxyprn.com/" },
      timeout: 20000,
    });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("title").text().replace(/ on the SexyPorn.*/i, "").replace(/ - sxyprn.*/i, "").trim() || "Untitled";
    let image = $('meta[property="og:image"]').attr("content") || $("img[data-src]").first().attr("data-src") || "";
    if (image.startsWith("//")) image = "https:" + image;

    const linkList = [
      { title: "Play", quality: "HD", directLinks: [{ title: "MP4", link, type: "mp4" }] },
    ];

    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return empty;
  }
};
