import { generateRagResponse, retrieveKnowledgeChunks } from "../src/lib/ragChatbot.ts";

console.log("=== testing Multilingual & Hinglish RAG Engine ===");

const testQueries = [
  { q: "hostel se bag uthane ka kya charge hai", expectedKbId: "kb-05" },
  { q: "room ka kitna kiraya hai", expectedKbId: "kb-09" },
  { q: "khana kitne me milta hai", expectedKbId: "kb-10" },
  { q: "10000 ka bima claim kaise hoga", expectedKbId: "kb-08" },
  { q: "senior host kitna kamayenge", expectedKbId: "kb-11" },
];

let allPassed = true;

for (const { q, expectedKbId } of testQueries) {
  const chunks = retrieveKnowledgeChunks(q, 1);
  const resp = generateRagResponse(q, "en");
  const matchedId = chunks[0]?.id;
  console.log(`\nQuery: "${q}"`);
  console.log(`  -> Matched KB ID: ${matchedId} (${chunks[0]?.question})`);
  console.log(`  -> Confidence Score: ${resp.confidenceScore}%`);

  if (matchedId !== expectedKbId) {
    console.error(`❌ KB MISMATCH: Expected ${expectedKbId}, got ${matchedId}`);
    allPassed = false;
  } else if (resp.confidenceScore < 60) {
    console.error(`❌ LOW CONFIDENCE score: ${resp.confidenceScore}%`);
    allPassed = false;
  } else {
    console.log(`  ✓ PERFECT MATCH (${expectedKbId}) & HIGH CONFIDENCE (${resp.confidenceScore}%)`);
  }
}

if (!allPassed) {
  process.exit(1);
}

console.log("\n✅ ALL MULTILINGUAL RAG TESTS PASSED CLEANLY!");
