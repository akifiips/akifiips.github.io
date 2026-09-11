(() => {
  'use strict';
  const script = document.currentScript;
  const base = new URL('../', script.src);
  document.querySelectorAll('[data-site-link]').forEach(a => {
    a.href = new URL(a.dataset.siteLink, base).href;
    const here = location.pathname.replace(/\/$/, '/index.html');
    if (a.closest('.site-nav') && (new URL(a.href).pathname === here || (a.dataset.siteLink === 'blog.html' && here.includes('/posts/')))) a.setAttribute('aria-current', 'page');
  });
  const toc = document.querySelector('#TOC');
  const title = document.querySelector('#title-block-header');
  if (toc && title) {
    const old = toc.parentElement;
    const details = document.createElement('details');
    details.className = 'article-toc';
    const summary = document.createElement('summary');
    summary.textContent = 'In this article';
    details.append(summary, toc);
    title.after(details);
    if (old && !old.children.length) old.remove();
  }
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelectorAll('.post-row[data-categories]').forEach(row => { row.hidden = button.dataset.filter !== 'all' && !row.dataset.categories.split('|').includes(button.dataset.filter); });
  }));
  const dialog = document.querySelector('.search-dialog');
  if (!dialog) return;
  const input = dialog.querySelector('input');
  const results = dialog.querySelector('.search-results');
  const status = dialog.querySelector('.search-status');
  let entries = null, loading = null;
  async function search() {
    const q = input.value.trim().toLowerCase();
    results.replaceChildren();
    if (!q) { status.textContent = 'Search articles by topic, method, or keyword.'; return; }
    status.textContent = 'Searching…';
    try {
      if (!loading) loading = fetch(new URL('search-data.json', base)).then(r => { if (!r.ok) throw Error('unavailable'); return r.json(); });
      entries = await loading;
      if (q !== input.value.trim().toLowerCase()) return;
      const words = q.split(/\s+/);
      const matches = entries.filter(e => words.every(w => (e.title + ' ' + e.text).toLowerCase().includes(w)));
      status.textContent = matches.length ? `${matches.length} article${matches.length === 1 ? '' : 's'} found` : 'No articles found. Try another keyword.';
      for (const e of matches.slice(0, 20)) {
        const li = document.createElement('li'), a = document.createElement('a'), p = document.createElement('p');
        a.href = new URL(e.href, base).href; a.textContent = e.title;
        const start = Math.max(0, e.text.toLowerCase().indexOf(words[0]) - 50);
        p.textContent = (start ? '…' : '') + e.text.slice(start, start + 190) + '…';
        li.append(a, p); results.append(li);
      }
    } catch (_) { loading = null; status.textContent = 'Search could not load. Please try again, or browse the Blog.'; }
  }
  document.querySelector('.search-button').addEventListener('click', () => { dialog.showModal(); input.focus(); search(); });
  dialog.querySelector('.search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  input.addEventListener('input', search);
})();
