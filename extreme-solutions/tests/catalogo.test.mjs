import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const grid = html.match(/<!-- PROJECTS_START -->([\s\S]*?)<!-- PROJECTS_END -->/)[1];
const cards = grid.split('<article ').slice(1);

test('todas las tarjetas del catálogo comparten el mismo diseño (sin tarjeta destacada)', () => {
  assert.equal(cards.length, 9);
  for (const card of cards) {
    assert.match(card, /^class="project" /, 'clase distinta en: ' + card.slice(0, 120));
    for (const part of ['class="project-media"', 'class="project-body"', 'class="project-type"', '<h3>', 'class="chips"', 'class="project-links"', 'class="project-video" href="/proyecto/']) assert.ok(card.includes(part), part);
  }
  assert.ok(!grid.includes('project-featured'));
});

test('Plataforma web operativa conserva su texto y su enlace a /proyecto/ltv-maestro', () => {
  const ltv = cards.find(card => card.includes('data-project-id="ltv-maestro"'));
  assert.ok(ltv.includes('<span class="project-type">Plataforma web operativa</span>'));
  assert.ok(ltv.includes('href="/proyecto/ltv-maestro"'));
});

test('MCP Dual LLM Guard: tarjeta de IA con imagen local, enlaces a GitHub y M8ven, y textos en ambos idiomas', () => {
  const guard = cards.find(card => card.includes('data-project-id="mcp-dual-llm-guard"'));
  assert.ok(guard && guard.includes('data-category="tools"') && guard.includes('href="/proyecto/mcp-dual-llm-guard"'));
  assert.ok(guard.includes('src="/assets/mcp-dual-llm-guard.svg"'));
  assert.ok(readFileSync(new URL('../assets/mcp-dual-llm-guard.svg', import.meta.url), 'utf8').startsWith('<svg'));
  const project = JSON.parse(readFileSync(new URL('../data/projects.json', import.meta.url), 'utf8')).find(item => item.id === 'mcp-dual-llm-guard');
  assert.deepEqual(project.links.map(link => link.url), ['https://github.com/Erik755/mcp-dual-llm-guard', 'https://m8ven.ai/verified/verify?id=a5dad922de9566da']);
  const translations = JSON.parse(readFileSync(new URL('../data/translations.json', import.meta.url), 'utf8'));
  for (const text of [project.type, project.description, project.alt, 'Seguridad de IA', ...project.links.map(link => link.label)]) assert.ok(translations[text], text);
});
