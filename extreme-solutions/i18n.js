(() => {
  const translations = window.EXTREME_TRANSLATIONS || {};
  const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([spanish, english]) => [english, spanish]));
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const supported = new Set(['es', 'en']);
  let language;

  try {
    const requested = new URLSearchParams(location.search).get('lang');
    const stored = localStorage.getItem('extreme-language');
    language = supported.has(requested) ? requested : (supported.has(stored) ? stored : 'es');
  } catch {
    language = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'es';
  }

  const translate = value => language === 'en'
    ? (translations[value] || value)
    : (reverseTranslations[value] || value);

  function translateText(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest('script, style') || !node.textContent.trim()
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!originalText.has(node)) originalText.set(node, node.textContent);
      const source = originalText.get(node);
      const value = source.trim();
      node.textContent = source.replace(value, translate(value));
    });
  }

  function translateAttributes(root = document) {
    root.querySelectorAll('[placeholder], [aria-label], img[alt]').forEach(element => {
      if (!originalAttributes.has(element)) originalAttributes.set(element, {});
      const saved = originalAttributes.get(element);
      for (const attribute of ['placeholder', 'aria-label', 'alt']) {
        if (!element.hasAttribute(attribute)) continue;
        if (!(attribute in saved)) saved[attribute] = element.getAttribute(attribute);
        element.setAttribute(attribute, translate(saved[attribute]));
      }
    });
    document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]').forEach(meta => {
      if (!meta.dataset.originalContent) meta.dataset.originalContent = meta.content;
      meta.content = translate(meta.dataset.originalContent);
    });
  }

  function updateControls() {
    document.querySelectorAll('.language-toggle').forEach(button => {
      button.hidden = false;
      button.textContent = language === 'es' ? 'English' : 'Español';
      button.lang = language === 'es' ? 'en' : 'es';
      button.setAttribute('aria-label', language === 'es' ? 'Change language to English' : 'Cambiar idioma a español');
    });
  }

  function updateLinks() {
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const url = new URL(link.href, location.origin);
      if (url.origin !== location.origin || (!['/', '/privacidad'].includes(url.pathname) && !url.pathname.startsWith('/proyecto/'))) return;
      language === 'en' ? url.searchParams.set('lang', 'en') : url.searchParams.delete('lang');
      link.href = url.pathname + url.search + url.hash;
    });
  }

  function apply({ updateUrl = false } = {}) {
    document.documentElement.lang = language;
    if (!document.documentElement.dataset.originalTitle) document.documentElement.dataset.originalTitle = document.title;
    const originalTitle = document.documentElement.dataset.originalTitle;
    const titleSuffix = ' | Extreme Solutions';
    document.title = originalTitle.endsWith(titleSuffix)
      ? translate(originalTitle.slice(0, -titleSuffix.length)) + titleSuffix
      : translate(originalTitle);
    translateText();
    translateAttributes();
    updateControls();
    updateLinks();
    if (updateUrl) {
      const url = new URL(location.href);
      language === 'en' ? url.searchParams.set('lang', 'en') : url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    }
    window.dispatchEvent(new CustomEvent('extreme:languagechange', { detail: { language } }));
  }

  window.extremeI18n = {
    get language() { return language; },
    t: translate,
    apply,
    setLanguage(next) {
      if (!supported.has(next) || next === language) return;
      language = next;
      try { localStorage.setItem('extreme-language', language); } catch { /* Preference remains active for this page. */ }
      apply({ updateUrl: true });
    }
  };

  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelectorAll('.language-toggle').forEach(button => button.addEventListener('click', () => {
      window.extremeI18n.setLanguage(language === 'es' ? 'en' : 'es');
    }));
  });
})();
