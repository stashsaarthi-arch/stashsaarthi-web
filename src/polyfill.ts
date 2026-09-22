import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Fix for firebase-admin and @google-cloud/firestore __dirname ReferenceError in ESM
// @ts-expect-error
if (typeof __dirname === "undefined") {
  // @ts-expect-error
  globalThis.__dirname = dirname(fileURLToPath(import.meta.url));
}
