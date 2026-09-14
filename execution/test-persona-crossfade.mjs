import fs from "fs";
import path from "path";

console.log("=== Testing Task 138: Persona Transition Crossfade Architecture ===");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✅ PASSED: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

const designTokensPath = path.resolve("src/lib/designTokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf-8");

assert(
  designTokensContent.includes("PERSONA_CROSSFADE_TOKENS") &&
    designTokensContent.includes("durationMs: 250"),
  "src/lib/designTokens.ts exports PERSONA_CROSSFADE_TOKENS with 250ms duration"
);

assert(
  designTokensContent.includes("getPersonaTransitionClasses") &&
    designTokensContent.includes("getPersonaCrossfadeStyles"),
  "src/lib/designTokens.ts exports getPersonaTransitionClasses and getPersonaCrossfadeStyles helpers"
);

const stylesPath = path.resolve("src/styles.css");
const stylesContent = fs.readFileSync(stylesPath, "utf-8");

assert(
  stylesContent.includes("html.persona-transitioning") &&
    stylesContent.includes("250ms cubic-bezier(0.16, 1, 0.3, 1)"),
  "src/styles.css defines html.persona-transitioning with 250ms cubic-bezier crossfade"
);

assert(
  stylesContent.includes("@utility persona-crossfade-250ms"),
  "src/styles.css defines @utility persona-crossfade-250ms"
);

const personaContextPath = path.resolve("src/context/PersonaContext.tsx");
const personaContextContent = fs.readFileSync(personaContextPath, "utf-8");

assert(
  personaContextContent.includes("isPersonaTransitioning: boolean") &&
    personaContextContent.includes('classList.add("persona-transitioning")') &&
    personaContextContent.includes("setTimeout"),
  "src/context/PersonaContext.tsx manages isPersonaTransitioning and 250ms document class toggling"
);

const crossfadePath = path.resolve("src/components/ui/PersonaCrossfade.tsx");
assert(fs.existsSync(crossfadePath), "src/components/ui/PersonaCrossfade.tsx exists");

const primitivesPath = path.resolve("src/components/ui/primitives.ts");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

assert(
  primitivesContent.includes("PersonaCrossfade") &&
    primitivesContent.includes("PersonaCrossfadeProps"),
  "src/components/ui/primitives.ts re-exports PersonaCrossfade primitive"
);

console.log(`\nResults: ${passed}/${total} checks passed.`);
if (passed === total) {
  console.log("🎉 ALL PERSONA TRANSITION CROSSFADE CHECKS PASSED SUCCESSFULLY!");
}
