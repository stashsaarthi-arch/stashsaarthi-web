import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
globalThis.__dirname = dirname(fileURLToPath(import.meta.url));

const dir = __dirname;
console.log("Success:", dir);
