const fs = require('fs');

const mainJsPath = 'C:/Users/Dell/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(mainJsPath, 'utf8');

// Find all command strings registered
const regex = /['"]([a-zA-Z0-9_-]+\.[a-zA-Z0-9_.-]+)['"]/g;
const matchSet = new Set();
let m;
while ((m = regex.exec(content)) !== null) {
  const s = m[1];
  if (/(?:accept|approve|allow|run|apply|save)/i.test(s) && /(?:chat|edit|diff|agent|terminal|notification|action)/i.test(s)) {
    matchSet.add(s);
  }
}

console.log('Total commands matched:', matchSet.size);
Array.from(matchSet).sort().forEach(c => console.log(c));
