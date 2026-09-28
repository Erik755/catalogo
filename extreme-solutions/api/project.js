import { projects, projectPage } from '../lib/projects.js';

export default function handler(request, response) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).end();
  }
  const project = projects.find(item => item.id === request.query?.slug);
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
  return response.status(project ? 200 : 404).end(request.method === 'HEAD' ? undefined : projectPage(project));
}
