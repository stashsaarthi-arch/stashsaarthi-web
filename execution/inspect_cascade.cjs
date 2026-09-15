const fs = require('fs');

const mainJsPath = 'C:/Users/Dell/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(mainJsPath, 'utf8');

const needle = 'CASCADE_ACCEPT_ALL_IN_FILE';
const pos = content.indexOf(needle);
if (pos !== -1) {
  console.log(content.slice(pos - 200, pos + 600));
}
