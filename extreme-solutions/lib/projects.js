import { readFileSync } from 'node:fs';

export const projects = JSON.parse(readFileSync(new URL('../data/projects.json', import.meta.url), 'utf8'));
export const translations = JSON.parse(readFileSync(new URL('../data/translations.json', import.meta.url), 'utf8'));
const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([spanish, english]) => [english, spanish]));
export const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const translate = (value, language = 'es') => language === 'en'
  ? (translations[value] || value)
  : (reverseTranslations[value] || value);

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

export function projectPage(project, requestedLanguage = 'es') {
  const language = requestedLanguage === 'en' ? 'en' : 'es';
  const tr = value => translate(value, language);
  const title = tr(project ? project.title : 'Proyecto no encontrado');
  const languageQuery = language === 'en' ? '?lang=en' : '';
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escape(title)} | Extreme Solutions</title><meta name="description" content="${escape(tr(project?.description || 'Consulta los proyectos de Extreme Solutions.'))}">
    ${project ? '' : '<meta name="robots" content="noindex">'}
    <link rel="icon" type="image/png" href="/assets/embedded-1.png"><link rel="stylesheet" href="/base.css"><link rel="stylesheet" href="/dynamic.css"><script src="/i18n-data.js"></script><script src="/i18n.js"></script><script src="/preferences.js"></script></head>
    <body><a class="skip-link" href="#contenido">${escape(tr('Saltar al contenido'))}</a>
    <nav class="nav is-scrolled" aria-label="${escape(tr('Principal'))}"><div class="nav-inner"><a class="brand" href="/${languageQuery}"><span>Extreme Solutions</span></a><div class="detail-preferences"><button class="language-toggle" type="button" hidden>${escape(tr('Cambiar idioma'))}</button><button class="theme-toggle" type="button" hidden>${escape(tr('Cambiar tema'))}</button></div></div></nav>
    <main class="detail-page shell" id="contenido"><a href="/${languageQuery}#experiencia">${escape(tr('← Todos los proyectos'))}</a>
    <div class="detail-heading"><p class="eyebrow">${escape(tr(project?.type || 'Error 404'))}</p><h1>${escape(title)}</h1></div>
    ${project ? `<div class="detail-layout"><div><p class="lead">${escape(tr(project.description))}</p><h2>${escape(tr('Tecnologías y capacidades'))}</h2><div class="chips">${project.tags.map(tag => `<span class="chip">${escape(tr(tag))}</span>`).join('')}</div>
    <div class="detail-actions">${project.links.map(link => `<a class="btn dark" href="${escape(link.url)}" target="_blank" rel="noreferrer">${escape(tr(link.label))}</a>`).join('')}</div></div>
    <img class="detail-image" src="${escape(project.image)}" alt="${escape(tr(project.alt))}"></div>` : `<p>${escape(tr('Este proyecto no existe. Vuelve al catálogo para explorar las soluciones disponibles.'))}</p>`}
    </main><footer>© 2026 Extreme Solutions · Erik Sanchez</footer></body></html>`;
}
