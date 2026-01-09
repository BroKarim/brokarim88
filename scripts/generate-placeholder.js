const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const matter = require("gray-matter");

const CONTENT_DIRS = [path.join(process.cwd(), "content/work"), path.join(process.cwd(), "content/articles")];

const OUTPUT_PATH = path.join(process.cwd(), "constant/placeholders/metadata.json");

const IMAGE_REGEX = /\.(png|jpe?g|jpg|webp)$/i;
const VIDEO_REGEX = /\.(mp4|mov)$/i;

/**
 * Cloudinary transformations
 */
function generateImagePlaceholder(url) {
  return url.replace("/upload/", "/upload/w_20,q_30,e_blur:200/");
}

function generateVideoPlaceholder(url) {
  return url
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace("/upload/", "/upload/w_20,q_30,e_blur:200/")
    .replace(/\.(mp4|mov)$/i, ".jpg");
}

function hash(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * Load existing metadata (cache)
 */
function loadExisting() {
  if (!fs.existsSync(OUTPUT_PATH)) return {};
  return JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
}

/**
 * Scan MDX files and extract `media`
 */
function collectMediaUrls() {
  const urls = [];

  for (const dir of CONTENT_DIRS) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);

      if (typeof data.media === "string") {
        urls.push(data.media.split("?")[0]); // normalize Cloudinary URLs
      }
    }
  }

  return urls;
}

/**
 * Main
 */
function run() {
  const existing = loadExisting();
  const urls = collectMediaUrls();

  const next = { ...existing };

  for (const url of urls) {
    const currentHash = hash(url);

    if (existing[url] && existing[url].hash === currentHash) {
      continue; // cache hit
    }

    if (IMAGE_REGEX.test(url)) {
      next[url] = {
        type: "image",
        placeholder: generateImagePlaceholder(url),
        hash: currentHash,
      };
      continue;
    }

    if (VIDEO_REGEX.test(url)) {
      next[url] = {
        type: "video",
        placeholder: generateVideoPlaceholder(url),
        hash: currentHash,
      };
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(next, null, 2));

  console.log(`✓ Generated ${Object.keys(next).length} placeholders`);
}

run();
