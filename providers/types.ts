export interface Post { title: string; link: string; image: string; }
export interface Stream { server: string; link: string; type: string; headers?: Record<string, string>; }
export interface Info { title: string; synopsis: string; image: string; imdbId: string; type: string; linkList: { title: string; quality: string; directLinks: { title: string; link: string; type: string }[] }[]; }
export interface ProviderContext { axios: any; cheerio: any; }
