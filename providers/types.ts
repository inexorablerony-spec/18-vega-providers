export interface Post { title: string; link: string; image: string; }
export interface Stream { server: string; link: string; type: string; quality?: "360"|"480"|"720"|"1080"|"2160"; headers?: Record<string,string>; }
export interface Link { title: string; quality?: string; episodesLink?: string; directLinks?: { title: string; link: string; type?: "movie"|"series"; }[]; }
export interface Info { title: string; image: string; synopsis: string; imdbId: string; type: string; tags?: string[]; cast?: string[]; rating?: string; linkList: Link[]; }
export interface Catalog { title: string; filter: string; }
export interface ProviderContext { axios: any; cheerio: any; getBaseUrl?: (p: string)=>Promise<string>; commonHeaders?: Record<string,string>; extractors?: any; Aes?: any; }
