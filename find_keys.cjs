const fs = require('fs');

const mainJsPath = 'C:/Users/Dell/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
if (!fs.existsSync(mainJsPath)) {
  console.log('File not found:', mainJsPath);
  process.exit(1);
}

const content = fs.readFileSync(mainJsPath, 'utf8');

// Find all configuration keys or command names
const regex = /['"]((?:chat|files|workbench\.editor|diffEditor|antigravity)\.[a-zA-Z0-9_.]+)['"]/g;
let match;
const keys = new Set();
while ((match = regex.exec(content)) !== null) {
  const k = match[1];
  if (/accept|approv|edit|tool|save|confirm|prompt|diff/i.test(k)) {
    keys.add(k);
  }
}

console.log('--- FOUND KEYS ---');
Array.from(keys).sort().forEach(k => console.log(k));
