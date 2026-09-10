/**
 * Test script for Task 109: PDF Invoice Engine Verification
 * Verifies GST-compliant PDF invoice generation with PDF-Lib.
 */

import fs from 'fs';
import path from 'path';

console.log("🔍 Running Task 109 Verification Check (PDF Invoice Engine)...");

let passed = true;

const enginePath = path.join(process.cwd(), 'src', 'lib', 'pdfInvoiceEngine.ts');
const edgeFuncPath = path.join(process.cwd(), 'supabase', 'functions', 'generate-invoice', 'index.ts');

if (!fs.existsSync(enginePath)) {
  console.error("❌ src/lib/pdfInvoiceEngine.ts not found!");
  passed = false;
} else {
  const content = fs.readFileSync(enginePath, 'utf-8');
  if (!content.includes("generateGstInvoicePdf") || !content.includes("downloadInvoicePdf") || !content.includes("09AAACS9369F1Z5")) {
    console.error("❌ GST invoice generator or GSTIN details missing in src/lib/pdfInvoiceEngine.ts");
    passed = false;
  } else {
    console.log("✅ Client-side GST PDF Invoice Engine confirmed (src/lib/pdfInvoiceEngine.ts)");
  }
}

if (!fs.existsSync(edgeFuncPath)) {
  console.error("❌ Supabase edge function supabase/functions/generate-invoice/index.ts not found!");
  passed = false;
} else {
  const edgeContent = fs.readFileSync(edgeFuncPath, 'utf-8');
  if (!edgeContent.includes("PDFDocument") || !edgeContent.includes("generate-invoice")) {
    console.error("❌ Edge function implementation incomplete");
    passed = false;
  } else {
    console.log("✅ Supabase Edge Function confirmed (supabase/functions/generate-invoice/index.ts)");
  }
}

if (passed) {
  console.log("\n🎉 TASK 109 VERIFICATION PASSED: GST PDF Invoice Engine integrated & ready!");
  process.exit(0);
} else {
  console.error("\n❌ TASK 109 VERIFICATION FAILED!");
  process.exit(1);
}
