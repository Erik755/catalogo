// Copia solo los archivos públicos del sitio a la carpeta de salida que publica Vercel.
// Documentación interna, tests, scripts, datos fuente y configuración quedan fuera.
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../', import.meta.url));
const outDir = path.resolve(process.argv[2] || path.join(siteRoot, '..', 'dist'));
const publicTopLevel = /^(?:index\.html|privacidad\.html|[\w-]+\.(?:css|js))$/;
const publicAsset = /^[\w.-]+\.(?:png|webp|jpe?g|svg|ico|gif)$/i;

rmSync(outDir, { recursive: true, force: true });
mkdirSync(path.join(outDir, 'assets'), { recursive: true });
const copied = [];
for (const entry of readdirSync(siteRoot, { withFileTypes: true })) {
  if (entry.isFile() && publicTopLevel.test(entry.name)) {
    cpSync(path.join(siteRoot, entry.name), path.join(outDir, entry.name));
    copied.push(entry.name);
  }
}
for (const entry of readdirSync(path.join(siteRoot, 'assets'), { withFileTypes: true })) {
  if (entry.isFile() && publicAsset.test(entry.name)) {
    cpSync(path.join(siteRoot, 'assets', entry.name), path.join(outDir, 'assets', entry.name));
    copied.push('assets/' + entry.name);
  }
}
console.log(`Exported ${copied.length} public files to ${outDir}`);
