import { Stream, ProviderContext } from "../types";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  if (!link.includes(".mp4")) return [];
  if (link.includes("/dload/") && providerContext) {
    try {
      const { axios } = providerContext;
      const res = await axios.get(link, { 
        headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eporner.com/" }, 
        maxRedirects: 5,
        timeout: 15000,
        validateStatus: () => true
      });
      const finalUrl = res.request?.res?.responseUrl || res.config?.url || link;
      if (finalUrl && finalUrl !== link && finalUrl.includes(".mp4")) {
        return [{ server: "eporner", link: finalUrl, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
      }
    } catch {}
  }
  return [{ server: "eporner", link: link, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
};
