/**
 * Generate responsive WebP variants for all large image assets.
 * Outputs multiple widths for srcset usage.
 *
 * Usage: node execution/generate-responsive-images.mjs
 */
import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve, basename, extname, dirname } from "path";

const ROOT = resolve(import.meta.dirname, "..");

const IMAGE_SPECS = [
  {
    input: "public/images/founder_advik.jpg",
    sizes: [200, 400], // small avatar + profile card
    quality: 80,
  },
  {
    input: "public/images/product-microstorage.jpg",
    sizes: [320, 640, 1024], // mobile, tablet, desktop
    quality: 80,
  },
  {
    input: "public/images/og-banner-new.png",
    sizes: [640, 1200], // social share sizes
    quality: 80,
  },
  {
    input: "public/stashsaarthi-logo.png",
    sizes: [], // logo: full-size WebP only (already small)
    quality: 85,
  },
  {
    input: "public/app-icon.png",
    sizes: [], // icon: full-size WebP only
    quality: 85,
  },
];

for (const spec of IMAGE_SPECS) {
  const inputPath = resolve(ROOT, spec.input);
  if (!existsSync(inputPath)) {
    console.warn(`⚠ Skipping (not found): ${spec.input}`);
    continue;
  }

  const dir = dirname(inputPath);
  const name = basename(spec.input, extname(spec.input));

  // Full-size WebP
  const fullOut = resolve(dir, `${name}.webp`);
  if (!existsSync(fullOut)) {
    console.log(`🔄 ${spec.input} → ${name}.webp (full)`);
    execSync(
      `npx -y sharp-cli -i "${inputPath}" -o "${fullOut}" --format webp -q ${spec.quality}`,
      { cwd: ROOT, stdio: "inherit" },
    );
  } else {
    console.log(`✓ ${name}.webp already exists`);
  }

  // Resized variants
  for (const w of spec.sizes) {
    const sizedOut = resolve(dir, `${name}-${w}w.webp`);
    if (!existsSync(sizedOut)) {
      console.log(`🔄 ${spec.input} → ${name}-${w}w.webp`);
      execSync(
        `npx -y sharp-cli -i "${inputPath}" -o "${sizedOut}" --format webp -q ${spec.quality} resize ${w}`,
        { cwd: ROOT, stdio: "inherit" },
      );
    } else {
      console.log(`✓ ${name}-${w}w.webp already exists`);
    }
  }
}

console.log("\n✅ All responsive WebP variants generated.");
