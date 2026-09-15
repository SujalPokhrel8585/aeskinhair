// Rebuilds the site favicon from the logo mark used in the navbar
// (src/components/common/Navbar.tsx -> public/logo.webp).
//
// That logo is a wide lockup: the emblem mark (gold circle + AE monogram +
// silhouette + butterfly) on the left, the "AESTHETIC ESSENCE" wordmark on the
// right. The wordmark is illegible in a 16-32px browser tab, so this crops just
// the emblem out of the transparent artwork and centres it on a square white
// canvas. White is deliberate: the light-theme logo's silhouette is near-black,
// so an opaque white plate stays readable in both light and dark tab bars - and
// it matches the brand's white badge artwork used for social previews.
//
// The crop box is detected from the artwork itself (first run of non-transparent
// columns), so re-exporting the logo keeps this script working.
//
// Usage: node scripts/generate-favicon.mjs   (or: npm run generate:favicon)
import { statSync } from "node:fs";
import sharp from "sharp";

/** Navbar light-theme logo: black silhouette + gold mark, transparent backing. */
const SOURCE = "public/logo.webp";
/** Square canvases to emit. The 180px one is iOS' home-screen icon size. */
const OUTPUTS = [
  { file: "public/favicon.png", size: 256 },
  { file: "public/apple-touch-icon.png", size: 180 },
];
/** Transparent margin kept around the mark, as a fraction of the canvas. */
const PADDING_RATIO = 0.04;
/** Matches --background of the light theme (pure white). */
const BACKGROUND = { r: 255, g: 255, b: 255 };
/** Pixels this faint are treated as empty so stray noise can't skew the crop. */
const ALPHA_THRESHOLD = 8;

/** Locates the emblem mark: the first run of ink columns and its vertical span. */
async function findMarkBox(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const ink = (x, y) => data[(y * width + x) * channels + 3] > ALPHA_THRESHOLD;

  const column = new Array(width).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) if (ink(x, y)) column[x]++;
  }

  const left = column.findIndex((count) => count > 0);
  if (left === -1) throw new Error(`${file}: no visible artwork found`);
  let right = left;
  while (right + 1 < width && column[right + 1] > 0) right++;

  let top = height;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = left; x <= right; x++) {
      if (ink(x, y)) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        break;
      }
    }
  }

  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/** Crops the mark, scales it into a padded square and writes an opaque PNG. */
async function writeIcon(box, { file, size }) {
  const pad = Math.round(size * PADDING_RATIO);
  const mark = await sharp(SOURCE)
    .extract(box)
    .resize({ width: size - pad * 2, fit: "inside" })
    .flatten({ background: BACKGROUND })
    .png()
    .toBuffer({ resolveWithObject: true });

  const top = Math.floor((size - mark.info.height) / 2);
  const left = Math.floor((size - mark.info.width) / 2);
  const info = await sharp(mark.data)
    .extend({
      top,
      left,
      bottom: size - mark.info.height - top,
      right: size - mark.info.width - left,
      background: BACKGROUND,
    })
    .png({ compressionLevel: 9 })
    .toFile(file);

  console.log(
    `${file}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB  ` +
      `(mark ${box.width}x${box.height} cropped at ${box.left},${box.top})`,
  );
}

const box = await findMarkBox(SOURCE);
for (const output of OUTPUTS) await writeIcon(box, output);
console.log(`source: ${SOURCE} (${Math.round(statSync(SOURCE).size / 1024)} KB)`);
