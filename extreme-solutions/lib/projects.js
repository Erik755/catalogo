import { readFileSync } from 'node:fs';

export const projects = JSON.parse(readFileSync(new URL('../data/projects.json', import.meta.url), 'utf8'));
export const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const ids = new Set();
for (const project of projects) {
  if (!/^[a-z0-9-]+$/.test(project.id) || ids.has(project.id)) throw new Error('Invalid or duplicate project id');
  ids.add(project.id);
  if (!['android', 'web', 'tools'].includes(project.category)) throw new Error('Invalid category');
  if (!project.title || !project.description || !Array.isArray(project.tags)) throw new Error('Incomplete project');
  if (!/^\/assets\/[a-zA-Z0-9.-]+$/.test(project.image) && !project.image.startsWith('https://')) throw new Error('Invalid image');
  for (const link of project.links) if (new URL(link.url).protocol !== 'https:') throw new Error('Unsafe project link');
}

export function card(project) {
  return `<article class="project${project.featured ? ' project-featured' : ''}" data-category="${project.category}" data-project-id="${project.id}">
    <div class="project-media"><img loading="lazy" decoding="async" src="${escape(project.image)}" alt="${escape(project.alt)}"${project.id === 'ltv-maestro' ? ' class="ltv-media"' : ''}></div>
    <div class="project-body"><span class="project-type">${escape(project.type)}</span>
    <h3>${escape(project.title)}</h3><p>${escape(project.description)}</p>
    <div class="chips">${project.tags.map(tag => `<span class="chip">${escape(tag)}</span>`).join('')}</div>
    <div class="project-links"><a class="project-video" href="/proyecto/${project.id}">Explorar proyecto →</a>
    <button class="save-project" type="button" data-save="${project.id}" aria-pressed="false" aria-label="Guardar ${escape(project.title)}" hidden>Guardar</button></div></div></article>`;
}

export function projectPage(project) {
  const title = project ? project.title : 'Proyecto no encontrado';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escape(title)} | Extreme Solutions</title><meta name="description" content="${escape(project?.description || 'Consulta los proyectos de Extreme Solutions.')}">
    ${project ? '' : '<meta name="robots" content="noindex">'}
    <link rel="stylesheet" href="/base.css"><link rel="stylesheet" href="/dynamic.css"><script src="/preferences.js"></script></head>
    <body><a class="skip-link" href="#contenido">Saltar al contenido</a>
    <nav class="nav is-scrolled" aria-label="Principal"><div class="nav-inner"><a class="brand" href="/"><span>Extreme Solutions</span></a><button class="theme-toggle" type="button" hidden>Cambiar tema</button></div></nav>
    <main class="detail-page shell" id="contenido"><a href="/#experiencia">← Todos los proyectos</a>
    <div class="detail-heading"><p class="eyebrow">${escape(project?.type || 'Error 404')}</p><h1>${escape(title)}</h1></div>
    ${project ? `<div class="detail-layout"><div><p class="lead">${escape(project.description)}</p><h2>Tecnologías y capacidades</h2><div class="chips">${project.tags.map(tag => `<span class="chip">${escape(tag)}</span>`).join('')}</div>
    <div class="detail-actions">${project.links.map(link => `<a class="btn dark" href="${escape(link.url)}" target="_blank" rel="noreferrer">${escape(link.label)}</a>`).join('')}<a class="btn light" href="/#pagos">Pagar un servicio acordado</a></div></div>
    <img class="detail-image" src="${escape(project.image)}" alt="${escape(project.alt)}"></div>` : '<p>Este proyecto no existe. Vuelve al catálogo para explorar las soluciones disponibles.</p>'}
    </main><footer>© 2026 Extreme Solutions · Erik Sanchez</footer></body></html>`;
}
