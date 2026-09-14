import fs from 'node:fs';
import path from 'node:path';

function runTests() {
  console.log('🧪 Starting Saarthi Spaces Card 2.0 (Task 142) Verification Suite...');
  let errors = 0;

  // 1. Check designTokens.ts
  const tokensPath = path.resolve('src/lib/designTokens.ts');
  const tokensContent = fs.readFileSync(tokensPath, 'utf8');
  if (
    tokensContent.includes('SAARTHI_SPACES_CARD_TOKENS') &&
    tokensContent.includes('getSaarthiSpacesCardTokens')
  ) {
    console.log('✅ PASS: designTokens.ts contains SAARTHI_SPACES_CARD_TOKENS & helper');
  } else {
    console.error('❌ FAIL: SAARTHI_SPACES_CARD_TOKENS missing in designTokens.ts');
    errors++;
  }

  // 2. Check styles.css
  const stylesPath = path.resolve('src/styles.css');
  const stylesContent = fs.readFileSync(stylesPath, 'utf8');
  if (
    stylesContent.includes('spaces-card-16-9-stage') &&
    stylesContent.includes('zero-brokerage-pill-glow') &&
    stylesContent.includes('verified-host-shield-badge')
  ) {
    console.log('✅ PASS: styles.css contains Saarthi Spaces Card 2.0 CSS utilities');
  } else {
    console.error('❌ FAIL: Missing CSS utilities in styles.css');
    errors++;
  }

  // 3. Check primitive component file
  const compPath = path.resolve('src/components/ui/SaarthiSpacesCard2.tsx');
  if (fs.existsSync(compPath)) {
    const compContent = fs.readFileSync(compPath, 'utf8');
    if (
      compContent.includes('SaarthiSpacesCard2') &&
      compContent.includes('spaces-card-16-9-stage') &&
      compContent.includes('verified-host-shield-badge')
    ) {
      console.log('✅ PASS: SaarthiSpacesCard2.tsx component created with required features');
    } else {
      console.error('❌ FAIL: SaarthiSpacesCard2.tsx content is incomplete');
      errors++;
    }
  } else {
    console.error('❌ FAIL: SaarthiSpacesCard2.tsx file missing');
    errors++;
  }

  // 4. Check primitives.ts export
  const primPath = path.resolve('src/components/ui/primitives.ts');
  const primContent = fs.readFileSync(primPath, 'utf8');
  if (primContent.includes('SaarthiSpacesCard2')) {
    console.log('✅ PASS: primitives.ts re-exports SaarthiSpacesCard2');
  } else {
    console.error('❌ FAIL: primitives.ts does not export SaarthiSpacesCard2');
    errors++;
  }

  // 5. Check Rooms.tsx integration
  const roomsPath = path.resolve('src/components/stash/Rooms.tsx');
  const roomsContent = fs.readFileSync(roomsPath, 'utf8');
  if (roomsContent.includes('SaarthiSpacesCard2')) {
    console.log('✅ PASS: Rooms.tsx renders SaarthiSpacesCard2');
  } else {
    console.error('❌ FAIL: Rooms.tsx does not use SaarthiSpacesCard2');
    errors++;
  }

  if (errors > 0) {
    console.error(`\n❌ Suite finished with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL Task 142 VERIFICATION TESTS PASSED SUCCESSFULLY!');
  }
}

runTests();
