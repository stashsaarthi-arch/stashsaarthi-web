import fs from 'fs';
import path from 'path';

function createBarrel(relDir) {
  const dir = path.resolve(relDir);
  const files = fs.readdirSync(dir).filter(f => {
    return (f.endsWith('.tsx') || f.endsWith('.ts')) && f !== 'index.ts' && f !== 'index.tsx';
  });

  const lines = files.map(f => {
    const base = f.replace(/\.(tsx|ts)$/, '');
    return `export * from './${base}';`;
  });

  const targetPath = path.join(dir, 'index.ts');
  fs.writeFileSync(targetPath, lines.join('\n') + '\n', 'utf8');
  console.log(`Created ${targetPath} with ${files.length} exports.`);
}

createBarrel('src/components/ui');
createBarrel('src/components/stash');
