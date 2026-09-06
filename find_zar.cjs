const fs = require('fs');

const mainJsPath = 'C:/Users/Dell/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(mainJsPath, 'utf8');

const pos = content.indexOf('enum:zar');
if (pos !== -1) {
  console.log(content.slice(pos - 300, pos + 100));
}

const zarDef = content.indexOf('var zar=');
if (zarDef !== -1) {
  console.log(content.slice(zarDef, zarDef + 300));
} else {
  const zarDef2 = content.indexOf('zar=');
  console.log(content.slice(zarDef2, zarDef2 + 300));
}
