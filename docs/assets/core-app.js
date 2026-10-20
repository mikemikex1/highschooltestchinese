(() => {
  const $ = s => document.querySelector(s), PAGE_SIZE = 1;
  const state = { mode: 'core', query: '', page: 1 };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const data = () => state.mode === 'core' ? window.coreTexts : window.mustKnow;
  function renderBody(body) {
    return body.split('\n').map(line => {
      const t = line.trim(); if (!t) return '';
      if (/^## /.test(t)) return `<h3>${esc(t.slice(3))}</h3>`;
      if (/^### /.test(t)) return `<h4>${esc(t.slice(4))}</h4>`;
      if (/^---/.test(t)) return '<hr>';
      if (/^\|/.test(t)) return `<pre class="table-text">${esc(t)}</pre>`;
      if (/^(?:[-*] |\d+[.)] |[A-E]\. )/.test(t)) return `<p class="source-line bullet">${esc(t)}</p>`;
      return `<p class="source-line">${esc(t)}</p>`;
    }).join('');
  }
  function render() {
    const items = data().filter(x => !state.query || JSON.stringify(x).toLowerCase().includes(state.query.toLowerCase()));
    const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE)); state.page = Math.min(state.page, pages);
    const visible = items.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
    $('#toc').innerHTML = items.map((x, i) => `<button class="toc-link" data-page="${i + 1}">${esc(x.title)}</button>`).join('') || '<p class="empty">找不到符合條件的內容。</p>';
    $('#cards').innerHTML = visible.map(x => `<article class="lesson core-card"><div class="lesson-head"><div><span class="unit">${state.mode === 'core' ? '核心課文' : '必背資料'}</span><h2>${esc(x.title)}</h2></div></div><div class="core-source">來源：${esc(x.source)}</div><div class="core-body">${renderBody(x.body)}</div></article>`).join('') || '<div class="empty-box">找不到符合條件的內容。</div>';
    $('#pager').innerHTML = items.length ? `<button data-page="prev" ${state.page === 1 ? 'disabled' : ''}>上一頁</button><span>第 ${state.page} / ${pages} 頁</span><button data-page="next" ${state.page === pages ? 'disabled' : ''}>下一頁</button>` : '';
  }
  $('#search').addEventListener('input', e => { state.query = e.target.value.trim(); state.page = 1; render(); });
  document.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => { state.mode = b.dataset.mode; state.page = 1; document.querySelectorAll('.mode').forEach(x => x.classList.toggle('active', x === b)); render(); }));
  $('#toc').addEventListener('click', e => { const b = e.target.closest('[data-page]'); if (!b) return; state.page = Number(b.dataset.page); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  $('#pager').addEventListener('click', e => { const b = e.target.closest('[data-page]'); if (!b || b.disabled) return; state.page += b.dataset.page === 'next' ? 1 : -1; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  $('#themeBtn').addEventListener('click', () => document.body.classList.toggle('dark'));
  $('#topBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  render();
})();
