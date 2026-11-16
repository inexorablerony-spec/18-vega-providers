import { Info, ProviderContext } from "../types";
const UA = "Mozilla/5.0";

export async function getMeta({ link, providerContext }: any): Promise<Info> {
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA }, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const title = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || "Video";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const synopsis = $('meta[property="og:description"]').attr("content") || "";
    return {
      title, synopsis, image, imdbId: "", type: "movie",
      linkList: [{ title: "Play", quality: "auto", directLinks: [{ title: "Play", link, type: "movie" }] }],
    };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
}
