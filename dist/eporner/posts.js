// @vega-provider eporner
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ filter, page = 1, signal, providerContext }) {
  try {
    const { axios } = providerContext;
    const BASE = "https://www.eporner.com";
    const order = filter || "latest";
    const url = BASE + "/api/v2/video/search/?order=" + encodeURIComponent(order) + "&per_page=30&page=" + page;
    const res = await axios.get(url, { 
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "application/json" }, 
      signal, 
      timeout: 20000,
      responseType: "json"
    });
    let data = res.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { return []; }
    }
    const videos = (data && data.videos) || [];
    const posts = [];
    for (const v of videos) {
      if (!v || !v.id) continue;
      posts.push({
        title: v.title || "Untitled",
        link: v.url || (BASE + "/video-" + v.id + "/"),
        image: (v.default_thumb && v.default_thumb.src) || (v.thumbs && v.thumbs[0] && v.thumbs[0].src) || "",
      });
    }
    return posts;
  } catch (e) { 
    return []; 
  }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios } = providerContext;
    const BASE = "https://www.eporner.com";
    const url = BASE + "/api/v2/video/search/?query=" + encodeURIComponent(searchQuery) + "&per_page=30&page=" + page;
    const res = await axios.get(url, { 
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "application/json" }, 
      signal, 
      timeout: 20000,
      responseType: "json"
    });
    let data = res.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { return []; }
    }
    const videos = (data && data.videos) || [];
    const posts = [];
    for (const v of videos) {
      if (!v || !v.id) continue;
      posts.push({
        title: v.title || "Untitled",
        link: v.url || (BASE + "/video-" + v.id + "/"),
        image: (v.default_thumb && v.default_thumb.src) || "",
      });
    }
    return posts;
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
