const fs = require("fs");
const path = require("path");

// Use GITHUB_PAGES env var instead of NODE_ENV
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/income-tax-calculator" : "";

// Read the source manifest
const manifestPath = path.join(__dirname, "../public/manifest.webmanifest");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

// Update scope and start_url with basePath
manifest.scope = basePath ? basePath + "/" : "/";
manifest.start_url = basePath ? basePath + "/" : "/";

// Update icon paths with basePath for production
manifest.icons = manifest.icons.map((icon) => {
  const iconSrc = icon.src.startsWith("/") ? icon.src : "/" + icon.src;
  return {
    ...icon,
    src: basePath ? basePath + iconSrc : iconSrc,
  };
});

// Write to out directory (overwriting the one Next.js copied)
const outManifestPath = path.join(__dirname, "../out/manifest.webmanifest");

fs.writeFileSync(outManifestPath, JSON.stringify(manifest, null, 2));

console.log(
  `✅ Manifest updated with basePath: "${basePath}" at ${outManifestPath}`,
);

console.log(`Manifest updated with basePath: ${basePath || "/"}`);
