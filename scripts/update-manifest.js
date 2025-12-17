const fs = require("fs");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/income-tax-calculator" : "";

// Read the source manifest
const manifestPath = path.join(__dirname, "../public/manifest.webmanifest");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

// Update scope and start_url with basePath
manifest.scope = basePath + "/";
manifest.start_url = basePath + "/";

// Icon paths don't need basePath prefix since they're relative and Next.js handles them
// Just ensure they start with /
manifest.icons = manifest.icons.map((icon) => ({
  ...icon,
  src: icon.src.startsWith("/") ? icon.src : "/" + icon.src,
}));

// Write to out directory (overwriting the one Next.js copied)
const outManifestPath = path.join(__dirname, "../out/manifest.webmanifest");

fs.writeFileSync(outManifestPath, JSON.stringify(manifest, null, 2));

console.log(`Manifest updated with basePath: ${basePath || "/"}`);
