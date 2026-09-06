const fs = require('fs');

const mainJsPath = 'C:/Users/Dell/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(mainJsPath, 'utf8');

const pos = 24322358;
console.log(content.slice(pos - 500, pos + 1500));
