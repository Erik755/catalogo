import { readFileSync, writeFileSync } from 'node:fs';
import { projects, card } from '../lib/projects.js';
const path = new URL('../index.html', import.meta.url);
const translations = JSON.parse(readFileSync(new URL('../data/translations.json', import.meta.url), 'utf8'));
const html = readFileSync(path, 'utf8');
if (!html.includes('<!-- PROJECTS_START -->') || !html.includes('<!-- PROJECTS_END -->')) throw new Error('Catalog markers missing');
writeFileSync(path, html.replace(/<!-- PROJECTS_START -->[\s\S]*?<!-- PROJECTS_END -->/,
  `<!-- PROJECTS_START -->\n<div class="projects" id="project-grid">${projects.map(card).join('\n')}</div>\n<!-- PROJECTS_END -->`));
writeFileSync(new URL('../i18n-data.js', import.meta.url), `window.EXTREME_TRANSLATIONS = ${JSON.stringify(translations, null, 2)};\n`);
console.log(`Built ${projects.length} project cards from data/projects.json`);
