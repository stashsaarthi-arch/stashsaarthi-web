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
allFiles.forEach(f => fileMap.set(f.toLowerCase().replace(/\\/g, '/'), f.replace(/\\/g, '/')));

let hasError = false;
allFiles.forEach(file => {
  if (!file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.js') && !file.endsWith('.jsx')) return;
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /from\s+['"]@\/(.+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    let target = 'src/' + importPath;
    const targetLower = target.toLowerCase();
    
    let actual = fileMap.get(targetLower) || fileMap.get(targetLower + '.ts') || fileMap.get(targetLower + '.tsx') || fileMap.get(targetLower + '/index.ts');
    if (!actual) continue;
    
    const importParts = target.split('/');
    const actualParts = actual.split('/');
    
    for (let i = 0; i < importParts.length; i++) {
       if (actualParts[i] && importParts[i].toLowerCase() === actualParts[i].toLowerCase() && importParts[i] !== actualParts[i]) {
           console.error('Case mismatch:', importPath, 'in file', file, 'expected', actual);
           hasError = true;
       }
    }
  }
});
if (hasError) process.exit(1);
console.log('No @/ case mismatches found.');
