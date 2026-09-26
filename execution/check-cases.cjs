const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const allFiles = walk('src');
const fileMap = new Map();
allFiles.forEach(f => fileMap.set(f.toLowerCase(), f));

let hasError = false;

allFiles.forEach(file => {
  if (!file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.js') && !file.endsWith('.jsx')) return;
  const content = fs.readFileSync(file, 'utf8');
  
  // Find relative imports
  const importRegex = /from\s+['"]([./].+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Attempt to resolve it
    const dir = path.dirname(file);
    let target = path.join(dir, importPath);
    
    // Check if it exists exactly
    if (fs.existsSync(target)) {
       // Could be a directory or exactly matched file with extension
    } else {
       // try appending extensions
       const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
       let foundExt = null;
       for (const ext of exts) {
         if (fs.existsSync(target + ext)) {
           foundExt = ext;
           break;
         }
       }
       if (foundExt) {
         target = target + foundExt;
       }
    }
    
    // If we resolved it, check case
    if (fs.existsSync(target)) {
      const targetLower = target.toLowerCase();
      if (fileMap.has(targetLower) && fileMap.get(targetLower) !== target) {
        console.error(`Case mismatch in ${file}: imports ${importPath}, resolved to ${target}, actual is ${fileMap.get(targetLower)}`);
        hasError = true;
      }
    }
  }
});

if (hasError) process.exit(1);
console.log("No case mismatches found in relative imports.");
