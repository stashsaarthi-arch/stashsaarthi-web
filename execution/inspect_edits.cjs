const fs = require('fs');

const mainJsPath = 'C:/Users/Dell/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(mainJsPath, 'utf8');

const needle = 'chat.tools.edits.autoApprove';
let pos = 0;
while ((pos = content.indexOf(needle, pos)) !== -1) {
  console.log('Pos:', pos);
  console.log(content.slice(Math.max(0, pos - 200), Math.min(content.length, pos + 400)));
  console.log('-------------------');
  pos += needle.length;
}
