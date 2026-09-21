import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Fix for firebase-admin and @google-cloud/firestore __dirname ReferenceError in ESM
// @ts-ignore
if (typeof __dirname === 'undefined') {
  // @ts-ignore
  globalThis.__dirname = dirname(fileURLToPath(import.meta.url));
}
