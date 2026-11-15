import { Stream, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const getStream = async function ({
  link,
}: {
  link: string;
  providerContext?: ProviderContext;
}): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) {
    return [];
  }

  let pathname = link;
  try {
    pathname = new URL(link).pathname;
  } catch {
    return [];
  }

  if (!/\.mp4$/i.test(pathname)) {
    return [];
  }

  const idMatch = link.match(/\/(?:dwnld|download)\/([a-z0-9]+)/i);
  const referer = idMatch ? `https://www.eporner.com/embed/${idMatch[1]}` : "https://www.eporner.com/";

  return [{
    server: "eporner",
    link,
    type: "mp4",
    headers: {
      Referer: referer,
      "User-Agent": UA,
      Accept: "*/*",
    },
  }];
};
