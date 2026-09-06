const fs = require('fs');

const mainJsPath = 'C:/Users/Dell/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(mainJsPath, 'utf8');

const targetKeys = [
  'chat.tools.edits.autoApprove',
  'chat.tools.global.autoApprove',
  'chat.tools.terminal.autoApprove',
  'chat.editing.autoAcceptDelay',
  'chat.tools.urls.autoApprove',
  'chat.undoEditsConfirmation',
  'antigravity.prioritized.agentAcceptAllInFile',
  'antigravity.prioritized.agentAcceptFocusedHunk',
  'files.refactoring.autoSave'
];

for (const key of targetKeys) {
  const idx = content.indexOf(key);
  if (idx !== -1) {
    console.log('=== ' + key + ' ===');
    console.log(content.slice(Math.max(0, idx - 100), Math.min(content.length, idx + 250)));
    console.log('\n');
  }
}
