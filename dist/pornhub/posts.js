// @vega-provider pornhub
// @vega-version 1.2
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios } = providerContext;
    const url = "https://www.pornhub.com/webmasters/search?ordering=mostrecent&page=" + page;
    const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal, timeout: 20000 });
    let data = res.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { return []; } }
    const videos = data.videos || [];
    return videos.map((v) => ({
      title: v.title || "Untitled",
      link: v.url || ("https://www.pornhub.com/view_video.php?viewkey=" + v.video_id),
      image: v.default_thumb || v.thumb || "",
    }));
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios } = providerContext;
    const url = "https://www.pornhub.com/webmasters/search?search=" + encodeURIComponent(searchQuery) + "&page=" + page;
    const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal, timeout: 20000 });
    let data = res.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { return []; } }
    const videos = data.videos || [];
    return videos.map((v) => ({
      title: v.title || "Untitled",
      link: v.url || ("https://www.pornhub.com/view_video.php?viewkey=" + v.video_id),
      image: v.default_thumb || v.thumb || "",
    }));
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
