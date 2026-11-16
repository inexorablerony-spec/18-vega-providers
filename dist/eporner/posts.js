"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getSearchPosts = getSearchPosts;
const BASE = "https://www.eporner.com";
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios } = providerContext;
            const url = BASE + "/api/v2/video/search/?order=latest&per_page=30&page=" + page;
            const res = yield axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal, timeout: 20000 });
            let data = res.data;
            if (typeof data === "string") {
                try {
                    data = JSON.parse(data);
                }
                catch (_b) {
                    return [];
                }
            }
            const videos = (data && data.videos) || [];
            return videos.map((v) => ({
                title: v.title || "Untitled",
                link: v.url || (BASE + "/video-" + v.id + "/"),
                image: (v.default_thumb && v.default_thumb.src) || "",
            }));
        }
        catch (_c) {
            return [];
        }
    });
}
function getSearchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, signal, providerContext }) {
        try {
            const { axios } = providerContext;
            const url = BASE + "/api/v2/video/search/?query=" + encodeURIComponent(searchQuery) + "&per_page=30&page=" + page;
            const res = yield axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal, timeout: 20000 });
            let data = res.data;
            if (typeof data === "string") {
                try {
                    data = JSON.parse(data);
                }
                catch (_b) {
                    return [];
                }
            }
            const videos = (data && data.videos) || [];
            return videos.map((v) => ({
                title: v.title || "Untitled",
                link: v.url || (BASE + "/video-" + v.id + "/"),
                image: (v.default_thumb && v.default_thumb.src) || "",
            }));
        }
        catch (_c) {
            return [];
        }
    });
}
