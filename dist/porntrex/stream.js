"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) { return link ? [{ server: "play", link, type: "mp4" }] : []; };
exports.getStream = getStream;
