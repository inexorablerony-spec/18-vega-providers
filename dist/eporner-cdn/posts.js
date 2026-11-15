// @vega-provider eporner-cdn
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios } = providerContext;
    const url = "https://www.eporner.com/api/v2/video/search/?order=latest&per_page=30&page=" + page;
    const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal, timeout: 20000 });
    let data = res.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { return []; } }
    return (data.videos || []).map((v) => ({ title: v.title || "Untitled", link: v.url, image: v.default_thumb?.src || "" }));
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios } = providerContext;
    const url = "https://www.eporner.com/api/v2/video/search/?query=" + encodeURIComponent(searchQuery) + "&per_page=30&page=" + page;
    const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal, timeout: 20000 });
    let data = res.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { return []; } }
    return (data.videos || []).map((v) => ({ title: v.title || "Untitled", link: v.url, image: v.default_thumb?.src || "" }));
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
