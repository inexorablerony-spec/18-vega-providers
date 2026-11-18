import { Stream, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://www.porn4fans.com/";

export const getStream = async function ({ 
  link 
}: { 
  link: string; 
  providerContext?: ProviderContext 
}): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  if (!/\.mp4/i.test(link)) return [];
  if (link.includes("preview")) return [];

  // Extract quality from URL
  const qualityMatch = link.match(/_(\d+p)\.mp4/i);
  const quality = qualityMatch ? qualityMatch[1] : "HD";

  return [{
    server: `Porn4Fans ${quality}`,
    link,
    type: "mp4",
    headers: { "User-Agent": UA, Referer: REFERER, Accept: "*/*" },
  }];
};
