import { DYNAMIC_PERSONA_FOOTER_TOKENS, getPersonaFooterTokens } from "../src/lib/designTokens.ts";

console.log("--- Testing Task 136: Dual Persona Footer Transformation ---");

const studentTokens = getPersonaFooterTokens("student");
console.log("Student Footer Tokens Title:", studentTokens.resourcesTitle);
if (studentTokens.resourcesTitle !== "Student Ecosystem & Resources") {
  throw new Error("Student resources title token mismatch!");
}

const hostTokens = getPersonaFooterTokens("host");
console.log("Host Footer Tokens Title:", hostTokens.resourcesTitle);
if (hostTokens.resourcesTitle !== "Senior Host Ecosystem & Legal Charters") {
  throw new Error("Host resources title token mismatch!");
}

console.log("✓ Task 136 Design Token Test Passed Successfully!");
