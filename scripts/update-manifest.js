const fs = require("fs");
const path = require("path");

// Read the source manifest
const manifestPath = path.join(__dirname, "../public/manifest.webmanifest");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

// For Netlify deployment, no basePath is needed
manifest.scope = "/";
manifest.start_url = "/";

// Icon paths should be root-relative
manifest.icons = manifest.icons.map((icon) => {
  const iconSrc = icon.src.startsWith("/") ? icon.src : "/" + icon.src;
  return {
    ...icon,
    src: iconSrc,
  };
});

// Write to out directory (overwriting the one Next.js copied)
const outManifestPath = path.join(__dirname, "../out/manifest.webmanifest");

fs.writeFileSync(outManifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Manifest updated at ${outManifestPath}`);
