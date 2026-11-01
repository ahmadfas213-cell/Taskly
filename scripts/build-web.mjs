import { cp, mkdir } from "node:fs/promises";

await mkdir("www/assets", { recursive: true });
for (const file of ["index.html", "style.css", "script.js", "features.js", "manifest.json"]) {
  await cp(file, "www/" + file);
}
await cp("assets", "www/assets", { recursive: true });
console.log("Taskly web assets prepared for Android.");
