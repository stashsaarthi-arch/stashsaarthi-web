import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Testing Hero CTA Button Glow, Shimmer Sweeps & Web Audio Overdrive...');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(` ✅ PASSED: ${message}`);
    passed++;
  } else {
    console.error(` ❌ FAILED: ${message}`);
    failed++;
  }
}

// 1. Check Audio API Export
const audioPath = path.join(rootDir, 'src', 'lib', 'audio.ts');
const audioContent = fs.readFileSync(audioPath, 'utf8');
assert(audioContent.includes('export const playHeroCtaClick'), 'src/lib/audio.ts exports playHeroCtaClick Web Audio function');

// 2. Check Design Tokens Export
const tokensPath = path.join(rootDir, 'src', 'lib', 'designTokens.ts');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');
assert(tokensContent.includes('HERO_CTA_TOKENS'), 'src/lib/designTokens.ts exports HERO_CTA_TOKENS');
assert(tokensContent.includes('getHeroCtaGlowClasses'), 'src/lib/designTokens.ts exports getHeroCtaGlowClasses helper');

// 3. Check CSS Animations and Utilities in styles.css
const cssPath = path.join(rootDir, 'src', 'styles.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes('@keyframes border-glow-rotate'), 'src/styles.css contains border-glow-rotate keyframes');
assert(cssContent.includes('@keyframes shimmer-sweep'), 'src/styles.css contains shimmer-sweep keyframes');
assert(cssContent.includes('@utility btn-shimmer-sweep'), 'src/styles.css contains btn-shimmer-sweep utility');
assert(cssContent.includes('@utility hero-cta-animated-border'), 'src/styles.css contains hero-cta-animated-border utility');
assert(cssContent.includes('@utility hero-cta-amber-border'), 'src/styles.css contains hero-cta-amber-border utility');

// 4. Check HeroCtaButton Component and Primitive Export
const componentPath = path.join(rootDir, 'src', 'components', 'ui', 'HeroCtaButton.tsx');
assert(fs.existsSync(componentPath), 'src/components/ui/HeroCtaButton.tsx exists');

const primitivesPath = path.join(rootDir, 'src', 'components', 'ui', 'primitives.ts');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
assert(primitivesContent.includes('HeroCtaButton'), 'src/components/ui/primitives.ts re-exports HeroCtaButton');

// 5. Check Hero Integration
const heroPath = path.join(rootDir, 'src', 'components', 'stash', 'Hero.tsx');
const heroContent = fs.readFileSync(heroPath, 'utf8');
assert(heroContent.includes('HeroCtaButton'), 'src/components/stash/Hero.tsx imports and mounts HeroCtaButton');

console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('✨ ALL HERO CTA BUTTON GLOW & SHIMMER CHECKS PASSED SUCCESSFULLY!');
}
