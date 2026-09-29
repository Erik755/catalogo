import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, card, projectPage, translate } from '../lib/projects.js';
import handler from '../api/project.js';

test('all catalog projects have server-rendered details and escaped content', () => {
  for (const project of projects) {
    assert.ok(card(project).includes(`/proyecto/${project.id}`));
    assert.ok(projectPage(project).includes(project.title));
  }
  const malicious = { ...projects[0], title: '<script>alert(1)</script>' };
  assert.ok(!projectPage(malicious).includes('<script>alert(1)</script>'));
});

test('project details are fully available in English', () => {
  for (const project of projects) {
    const html = projectPage(project, 'en');
    assert.ok(html.includes('<html lang="en">'));
    assert.ok(html.includes(translate(project.title, 'en')));
    assert.ok(html.includes(translate(project.description, 'en')));
    assert.ok(html.includes('Technologies and capabilities'));
    assert.ok(html.includes('/?lang=en#experiencia'));
    assert.ok(!html.includes('Tecnologías y capacidades'));
  }
  assert.ok(projectPage(undefined, 'en').includes('Project not found'));
});

function request(method, slug, lang) {
  const result = { headers: {} };
  handler({ method, query: { slug, lang } }, {
    setHeader: (key, value) => { result.headers[key] = value; },
    status(code) { result.status = code; return this; },
    end(body) { result.body = body; }
  });
  return result;
}
test('project endpoint: 200, 404, HEAD, and unsupported method', () => {
  assert.equal(request('GET', projects[0].id).status, 200);
  assert.equal(request('GET', '../../secrets').status, 404);
  assert.equal(request('GET', 'missing').status, 404);
  assert.equal(request('HEAD', projects[0].id).body, undefined);
  assert.equal(request('POST', projects[0].id).status, 405);
  assert.ok(request('GET', projects[0].id, 'en').body.includes('<html lang="en">'));
});
