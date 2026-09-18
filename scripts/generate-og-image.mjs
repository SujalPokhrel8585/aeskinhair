// Generates the 1200x630 social preview image (public/og-image.png) used by
// WhatsApp, Facebook, iMessage and X when the site is shared as a link —
// which is how most patients receive this URL. Square logos render poorly in
// those preview cards, so this produces a purpose-built branded card.
//
// The design uses the brand tokens from src/index.css: dark-teal clinical
// background (#11302d, the .dark --accent), gold (#C9A227, the --primary
// family) and the off-white foreground (#fbfaf7). The clinic emblem is
// composited from the same public/logo.webp used in the navbar.
//
// Re-run whenever the brand colours or logo change:
//   node scripts/generate-og-image.mjs
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = "public/og-image.png";
const SOURCE = "public/logo.webp";

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#11302d"/>
      <stop offset="1" stop-color="#1e4a44"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="1090" cy="90" r="260" fill="#C9A227" opacity="0.07"/>
  <circle cx="90" cy="580" r="200" fill="#C9A227" opacity="0.05"/>
  <text x="80" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-weight="bold" fill="#fbfaf7">AestheticEssence</text>
  <text x="82" y="392" font-family="Arial, Helvetica, sans-serif" font-size="30" letter-spacing="7" fill="#C9A227">SKIN &amp; HAIR CLINIC</text>
  <text x="82" y="470" font-family="Arial, Helvetica, sans-serif" font-size="27" fill="#d9d5c9">Dermatologist-led skin &amp; hair care in Kathmandu.</text>
  <text x="82" y="508" font-family="Arial, Helvetica, sans-serif" font-size="27" fill="#d9d5c9">HydraFacial, lasers, Botox, PRP &amp; GFC.</text>
  <text x="82" y="562" font-family="Arial, Helvetica, sans-serif" font-size="23" fill="#8fa8a3">City Square Mall (3rd Floor), Samakhushi Road, Kathmandu</text>
  <rect x="82" y="238" width="150" height="5" fill="#C9A227"/>
</svg>`;

// public/logo.webp is a wide lockup whose embedded wordmark turns to mush at
// small sizes (same problem the favicon script solves) — crop just the emblem
// mark and scale it up cleanly.
const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const inkAt = (x, y) => data[(y * info.width + x) * info.channels + 3] > 8;
const column = new Array(info.width).fill(0);
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) if (inkAt(x, y)) column[x]++;
}
const left = column.findIndex((count) => count > 0);
let right = left;
while (right + 1 < info.width && column[right + 1] > 0) right++;
let top = info.height;
let bottom = -1;
for (let y = 0; y < info.height; y++) {
  for (let x = left; x <= right; x++) {
    if (inkAt(x, y)) {
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      break;
    }
  }
}
const logo = await sharp(SOURCE)
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .resize(170, 170, { fit: "inside" })
  .png()
  .toBuffer();

const info2 = await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: 74, top: 48 }])
  .png({ compressionLevel: 9 })
  .toFile(OUTPUT);

console.log(
  `${OUTPUT}  ${info2.width}x${info2.height}  ${Math.round(info2.size / 1024)} KB  (emblem ${right - left + 1}x${bottom - top + 1} cropped at ${left},${top})`,
);