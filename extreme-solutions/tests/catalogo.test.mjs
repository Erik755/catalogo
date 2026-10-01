import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const grid = html.match(/<!-- PROJECTS_START -->([\s\S]*?)<!-- PROJECTS_END -->/)[1];
const cards = grid.split('<article ').slice(1);

test('todas las tarjetas del catálogo comparten el mismo diseño (sin tarjeta destacada)', () => {
  assert.equal(cards.length, 8);
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
