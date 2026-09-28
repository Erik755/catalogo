import { readFileSync, writeFileSync } from 'node:fs';
import { projects, card } from '../lib/projects.js';
const path = new URL('../index.html', import.meta.url);
const html = readFileSync(path, 'utf8');
if (!html.includes('<!-- PROJECTS_START -->') || !html.includes('<!-- PROJECTS_END -->')) throw new Error('Catalog markers missing');
writeFileSync(path, html.replace(/<!-- PROJECTS_START -->[\s\S]*?<!-- PROJECTS_END -->/,
  `<!-- PROJECTS_START -->\n<div class="projects" id="project-grid">${projects.map(card).join('\n')}</div>\n<!-- PROJECTS_END -->`));
console.log(`Built ${projects.length} project cards from data/projects.json`);
