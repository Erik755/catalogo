// Empaqueta la escena 3D con Three.js (versión fija) en ../hero3d.js: módulo ES minificado,
// sin dependencias externas (nada de CDN). Uso: cd extreme-solutions/src-3d && npm ci && npm run build
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
const three = JSON.parse(readFileSync(new URL('./node_modules/three/package.json', import.meta.url), 'utf8'));
if (three.version !== '0.186.1') throw new Error(`Se esperaba three@0.186.1 y hay ${three.version}`);
const result = await build({
  entryPoints: [new URL('./hero3d.src.js', import.meta.url).pathname],
  outfile: new URL('../hero3d.js', import.meta.url).pathname,
  bundle: true, format: 'esm', minify: true, target: ['es2020'], legalComments: 'eof', metafile: true,
  banner: { js: `/*! Extreme Solutions · escena 3D de la portada. Incluye three.js ${three.version} (https://threejs.org), licencia MIT: /licenses/three-LICENSE.txt */` }
});
const bytes = Object.values(result.metafile.outputs)[0].bytes;
console.log(`hero3d.js: ${(bytes / 1024).toFixed(1)} KiB (three ${three.version})`);
