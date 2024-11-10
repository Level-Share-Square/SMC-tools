const { Jimp } = require("jimp");
const fs = require("fs");
const path = require("path");
const { intToRGBA } = require("@jimp/utils");

const args = process.argv.slice(2).map((arg) => arg.replace(/\\/g, "/"));
const disableCoordReference = process.argv.slice(3) || false;

console.log("processing file: " + args[0]);
// resulting string for palette use
let outputString = "";
// Global variable to store coordinates from the first image
let referenceCoordinates = [];

// Load the image
const processImage = async (args) => {
  try {
    const image = await Jimp.read(args);
    const refLength = referenceCoordinates.length;
    // If the first image has already been processed, use its coordinates
    if (refLength !== 0 && !disableCoordReference) {
      for (let i = 0; i < refLength; i++) {
        // extract color from coordinate
        const { x, y } = referenceCoordinates[i];
        const hex = image.getPixelColor(x, y);
        const { r, g, b, a } = intToRGBA(hex);

        // skip transparent pixels
        if (a === 0) continue;

        // Store the color in the map to ensure uniqueness
        const rgbString = `${r},${g},${b}`;
        const endSymbol = refLength - 1 !== i ? " | " : " -- ";
        outputString += `${rgbString}${endSymbol}`;
      }
      return; // stop early
    }

    const colorMap = new Map();
    // Loop through each pixel
    for (let y = 0; y < image.bitmap.height; y++) {
      for (let x = 0; x < image.bitmap.width; x++) {
        const hex = image.getPixelColor(x, y); // Get pixel color as a hex value
        const { r, g, b, a } = intToRGBA(hex); // Convert hex to RGB

        // skip transparent pixels
        if (a === 0) continue;

        // Store the color in the map to ensure uniqueness
        const rgbString = `${r},${g},${b}`;
        if (!colorMap.has(rgbString)) {
          colorMap.set(rgbString, { r, g, b });
          referenceCoordinates.push({ x, y });
        }
      }
    }

    mapSize = colorMap.size;
    let key = 1;
    // Display the unique RGB values
    colorMap.forEach((rgb) => {
      const endSymbol = mapSize !== key ? " | " : " -- ";
      outputString += `${rgb.r},${rgb.g},${rgb.b}${endSymbol}`;
      key++;
    });
  } catch (err) {
    console.error("Error loading image:", err);
  }
};

// Check if a path is a directory
const isDir = (path) => fs.lstatSync(path).isDirectory();

// Get all files in a directory
const getFiles = (dir) => {
  return fs.readdirSync(dir).filter((file) => {
    const filePath = path.join(dir, file);
    return !isDir(filePath);
  });
};

const processImages = async (args) => {
  if (isDir(args)) {
    // If it's a folder, process all the files in it
    const files = getFiles(args);
    let num = 1;
    for (const file of files) {
      await processImage(path.join(args, file));
      console.log("Processed " + num++ + " of " + files.length + " files");
    }
    // cut off excess tail
    outputString = outputString.slice(0, -4);
    return true;
  }
  // If it's a file, process it directly
  await processImage(args);
  return false;
};

processImages(args[0]).then((multiple) => {
  console.log("Finished! resulting string:");
  console.log(multiple ? `"${outputString}"` : outputString.slice(0, -4));
});
