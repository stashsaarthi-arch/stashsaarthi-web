const fs = require('fs');

const files = [
  'src/components/stash/DamageClaimsModal.tsx',
  'src/components/stash/HostPayoutsModal.tsx',
  'src/components/stash/SmsFallbackGatewayModal.tsx',
  'src/components/stash/PeacockFeatherMatkiDusting.tsx',
  'src/components/stash/ScheduledPickupSelector.tsx'
];

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  
  text = text.replace(/import\s+\{([^}]+)\}\s+from\s+["']react["']/g, (match, imports) => {
    let newImports = imports.split(',').map(s => s.trim());
    if (!newImports.includes('useCallback')) {
      newImports.push('useCallback');
    }
    if (f.includes('ScheduledPickupSelector') && !newImports.includes('useRef')) {
      newImports.push('useRef');
    }
    if (f.includes('ScheduledPickupSelector') && !newImports.includes('useEffect')) {
      newImports.push('useEffect');
    }
    return `import { ${newImports.join(', ')} } from 'react'`;
  });
  
  fs.writeFileSync(f, text);
});
console.log("Imports updated successfully.");
