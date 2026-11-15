const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const PROVIDERS_DIR = "./providers";
const DIST_DIR = "./dist";
const providers = fs.readdirSync(PROVIDERS_DIR, { withFileTypes: true })
  .filter(i => i.isDirectory() && fs.existsSync(path.join(PROVIDERS_DIR, i.name, "catalog.ts")))
  .map(i => i.name);
console.log("Providers:", providers.join(", "));
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
for (const p of providers) {
  const d = path.join(DIST_DIR, p);
  if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true });
}
try { execSync("npx tsc", { stdio: "inherit" }); console.log("build OK"); }
catch (e) { console.error("build FAIL"); process.exit(1); }
