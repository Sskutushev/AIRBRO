/**
 * @file Script to optimize images (convert to WebP/AVIF, create responsive sizes).
 * @module scripts/optimize-images
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import cliProgress from 'cli-progress';

const INPUT_DIR = path.join(process.cwd(), 'public/images');
const OUTPUT_DIR = path.join(process.cwd(), 'public/images'); // Overwrite in place or create new folder? Let's overwrite for now.

const RESPONSIVE_WIDTHS = [320, 640, 1024, 1920];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

/**
 * Recursively finds all image files in a directory.
 * @param {string} dir - The directory to search.
 * @returns {string[]} An array of absolute paths to image files.
 */
function findImageFiles(dir) {
  let imageFiles = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      imageFiles = imageFiles.concat(findImageFiles(filePath));
    } else if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
      imageFiles.push(filePath);
    }
  }
  return imageFiles;
}

/**
 * Optimizes a single image file.
 * @param {string} filePath - The absolute path to the image file.
 * @returns {Promise<void>} A promise that resolves when optimization is complete.
 */
async function optimizeImage(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  const outputBaseDir = path.dirname(filePath); // Output to the same directory

  let originalSize = fs.statSync(filePath).size;
  let optimizedSize = 0;

  const image = sharp(filePath);

  // Get metadata to determine original dimensions
  const metadata = await image.metadata();
  const originalWidth = metadata.width;

  const operations = [];

  for (const width of RESPONSIVE_WIDTHS) {
    if (originalWidth && width > originalWidth) {
      // Don't upscale images
      continue;
    }

    // WebP version
    operations.push(
      image
        .clone()
        .resize(width)
        .webp({ quality: 80 })
        .toFile(path.join(outputBaseDir, `${baseName}-${width}w.webp`))
        .then(info => { optimizedSize += info.size; })
    );

    // AVIF version
    operations.push(
      image
        .clone()
        .resize(width)
        .avif({ quality: 70 })
        .toFile(path.join(outputBaseDir, `${baseName}-${width}w.avif`))
        .then(info => { optimizedSize += info.size; })
    );
  }

  // Also save the original format with responsive sizes if needed (optional, for fallback)
  // For simplicity, we'll just rely on the original file as fallback for now.

  await Promise.all(operations);

  return { originalSize, optimizedSize };
}

/**
 * Main function to run the image optimization.
 */
async function runOptimization() {
  console.log('Starting image optimization...');
  const imageFiles = findImageFiles(INPUT_DIR);
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  if (imageFiles.length === 0) {
    console.log('No image files found to optimize.');
    return;
  }

  progressBar.start(imageFiles.length, 0);

  for (let i = 0; i < imageFiles.length; i++) {
    const filePath = imageFiles[i];
    try {
      const { originalSize, optimizedSize } = await optimizeImage(filePath);
      totalOriginalSize += originalSize;
      totalOptimizedSize += optimizedSize;
      progressBar.update(i + 1);
    } catch (error) {
      console.error(`Error optimizing ${filePath}:`, error);
    }
  }

  progressBar.stop();

  const savedBytes = totalOriginalSize - totalOptimizedSize;
  const savedMB = (savedBytes / (1024 * 1024)).toFixed(2);

  console.log('\nImage optimization complete!');
  console.log(`Processed ${imageFiles.length} images.`);
  console.log(`Total original size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total optimized size: ${(totalOptimizedSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total size saved: ${savedMB} MB`);
}

runOptimization().catch(console.error);