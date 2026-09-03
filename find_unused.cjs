const fs = require("fs");
const path = require("path");

function getFiles(dir, exts, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      if (file !== "node_modules" && !file.startsWith(".")) {
        getFiles(path.join(dir, file), exts, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (exts.includes(ext)) {
        fileList.push(path.join(dir, file));
      }
    }
  }
  return fileList;
}

const allFiles = getFiles("src", [".ts", ".tsx", ".jsx", ".js"]);
const importedPaths = new Set();
for (const file of allFiles) {
  const content = fs.readFileSync(file, "utf-8");
  // Match `import ... from 'path'`
  const regex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let importPath = match[1];
    if (importPath.startsWith(".")) {
      importPath = path.join(path.dirname(file), importPath);
    }
    if (importPath.startsWith("@/")) {
      importPath = path.join("src", importPath.substring(2));
    }
    importedPaths.add(importPath.replace(/\\/g, "/"));
  }

  // Match `import('path')`
  const dynamicRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = dynamicRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (importPath.startsWith(".")) {
      importPath = path.join(path.dirname(file), importPath);
    }
    if (importPath.startsWith("@/")) {
      importPath = path.join("src", importPath.substring(2));
    }
    importedPaths.add(importPath.replace(/\\/g, "/"));
  }
}

const targetDirs = [
  path.join("src", "components"),
  path.join("src", "pages"),
  path.join("src", "lib"),
];
const unusedFiles = [];
for (const file of allFiles) {
  if (targetDirs.some((dir) => file.startsWith(dir))) {
    let isImported = false;
    let normalizedFile = file.replace(/\\/g, "/");
    let noExt = normalizedFile.replace(/\.[tj]sx?$/, "");
    let indexTrimmed = noExt.endsWith("/index") ? noExt.substring(0, noExt.length - 6) : null;

    for (const imp of importedPaths) {
      if (imp === normalizedFile || imp === noExt || imp === indexTrimmed) {
        isImported = true;
        break;
      }
    }

    if (!isImported) {
      unusedFiles.push(normalizedFile);
    }
  }
}

console.log(JSON.stringify(unusedFiles, null, 2));
