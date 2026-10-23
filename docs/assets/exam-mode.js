(() => {
  const root = () => document.querySelector('#lesson-view-root');
  const lessons = Array.isArray(window.lessonData) ? window.lessonData : [];
  const quizState = window.quizStateByQuestionId || (window.quizStateByQuestionId = Object.create(null));
  const constructedState = window.constructedStateByQuestionId || (window.constructedStateByQuestionId = Object.create(null));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const answerLetters = (answer) => [...new Set(String(answer ?? '').toUpperCase().match(/[A-E]/g) || [])].sort();
  const entries = (options) => Object.entries(options || {}).map(([rawKey, value]) => ({ key: /^[0-4]$/.test(rawKey) ? String.fromCharCode(65 + Number(rawKey)) : rawKey.toUpperCase(), text: typeof value === 'object' ? value.text || value.label || '' : String(value ?? '') }));
  const questionId = (lesson, question, index) => String(question.questionId || question.id || (question.year && question.number ? `${question.year}-Q${question.number}` : `${lesson.number}-real-${index}`));
  const yearOf = (question, id) => Number(question.year || String(id).match(/^(\d{3})/)?.[1] || 0);
  const numberOf = (question, id) => Number(question.number || String(id).match(/-Q(\d+)/i)?.[1] || 0);
  const questions = [];
  lessons.forEach((lesson) => {
    const source = [];
    if (lesson.yearQ1) source.push({ ...lesson.yearQ1, questionId: lesson.yearQ1.questionId || `${lesson.number}-yearQ1`, _yearQ1: true });
    (lesson.real || []).forEach((question) => source.push(question));
    source.forEach((question, index) => questions.push({ id: questionId(lesson, question, index), year: yearOf(question, questionId(lesson, question, index)), number: numberOf(question, questionId(lesson, question, index)), lesson, question }));
  });
  questions.sort((a, b) => a.year - b.year || a.number - b.number || a.id.localeCompare(b.id));
  const examQuestions = []; const seenQuestionIds = new Set();
  questions.filter((record) => record.year >= 111 && record.year <= 115).forEach((record) => { if (!seenQuestionIds.has(record.id)) { seenQuestionIds.add(record.id); examQuestions.push(record); } });
  const passageFor = (question) => String(question.passage || question.material || question.text || '').trim();
  const groupKeyFor = (record) => {
    const explicit = record.question.groupId || record.question.group || record.question.questionGroup;
    if (explicit) return `${record.year}:${explicit}`;
    const passage = passageFor(record.question).replace(/\s+/g, ' ').slice(0, 240);
    return `${record.year}:${passage || record.id}`;
  };
  const groups = [];
  const groupByKey = new Map();
  examQuestions.forEach((record) => {
    const key = groupKeyFor(record);
    let group = groupByKey.get(key);
    if (!group) { group = { id: `g${String(groups.length + 1).padStart(2, '0')}`, year: record.year, key, items: [] }; groupByKey.set(key, group); groups.push(group); }
    group.items.push(record);
    record.group = group;
  });
  const examIndex = Object.create(null);
  questions.forEach((record) => { const current = examIndex[record.id] || { questionId: record.id, year: record.year, number: record.number, groupId: `${record.year}-${record.group?.id || 'g01'}`, lessonNumbers: [] }; if (!current.lessonNumbers.includes(record.lesson.number)) current.lessonNumbers.push(record.lesson.number); examIndex[record.id] = current; });
  window.examIndex = examIndex;
  window.examQuestionRecords = questions;

  const params = () => new URLSearchParams(location.hash.slice(1));
  const currentRecord = () => {
    const search = params(); const year = Number(search.get('year') || 0); const q = Number(search.get('question') || 0); const group = search.get('group');
    const found = examQuestions.find((record) => record.year === year && record.number === q);
    if (found) return found;
    const byGroup = groups.find((item) => item.year === year && item.id === `g${String(Number(group || 1)).padStart(2, '0')}`);
    return byGroup?.items[0] || examQuestions[0];
  };
  const examHash = (record) => `#mode=exam&year=${record.year}&group=${record.group.id}&question=${String(record.number).padStart(2, '0')}`;
  const navigate = (record) => { if (record) history.pushState(null, '', examHash(record)); renderFromHash(); };
  const selectedLabel = (selected) => (selected || []).slice().sort().join('、') || '未作答';
  const isMulti = (record) => answerLetters(record.question.answer).length > 1 || /多選|複選/.test(String(record.question.type || record.question.questionType || ''));
  const isCorrect = (record, selected) => { const official = answerLetters(record.question.answer); const actual = [...new Set(selected || [])].sort(); return actual.length === official.length && actual.every((letter, index) => letter === official[index]); };
  const renderMaterial = (record) => { const passage = passageFor(record.question); const prompt = String(record.question.prompt || record.question.question || '').trim(); return `${passage ? `<section class="exam-material"><h3>題組材料</h3><p>${esc(passage)}</p></section>` : ''}${prompt && prompt !== passage ? `<p class="exam-prompt">${esc(prompt)}</p>` : ''}`; };
  const renderOptions = (record, state, submitted) => entries(record.question.options).map((entry) => { const chosen = (state.selected || []).includes(entry.key); let result = ''; let cls = chosen ? ' selected' : ''; if (submitted) { const official = answerLetters(record.question.answer); const good = official.includes(entry.key); cls += good ? ' correct' : (chosen ? ' incorrect' : ' neutral'); result = `<span class="exam-option-result">${chosen && good ? '你的答案・正確答案 ✅' : chosen ? '你的答案 ❌' : good ? '正確答案 ✅' : ''}</span>`; } return `<button type="button" class="exam-option${cls}" data-exam-option="${esc(entry.key)}" role="${isMulti(record) ? 'checkbox' : 'radio'}" aria-checked="${chosen}" ${submitted ? 'disabled' : ''}><span class="exam-option-key">${esc(entry.key)}</span><span>${esc(entry.text)}</span>${result}</button>`; }).join('');
  const renderSubmitted = (record, state) => { const right = isCorrect(record, state.selected); const official = answerLetters(record.question.answer); const explanation = record.question.correct || record.question.explanation || '本題解析依既有教材與官方材料整理。'; return `<section class="exam-result ${right ? 'correct' : 'incorrect'}"><strong>${right ? '✅ 答對了' : '❌ 答案不正確'}</strong><span>你的答案：${esc(selectedLabel(state.selected))}</span><span>官方答案：${esc(official.join('、') || record.question.answer || '非選題')}</span></section><section class="exam-core"><h3>為什麼？</h3><p>${esc(explanation)}</p></section><details class="exam-analysis"><summary>查看逐項解析</summary><p>${esc(record.question.explanation || explanation)}</p></details>`; };
  const renderConstructed = (record, state) => { const q = record.question; const submitted = !!state.submitted; return `<section class="exam-constructed"><label for="exam-answer">作答區</label><textarea id="exam-answer" data-exam-answer rows="5" ${submitted ? 'disabled' : ''}>${esc(state.response || '')}</textarea><button type="button" class="exam-submit" data-exam-submit>${submitted ? '已確認' : '確認作答'}</button>${state.notice ? `<p class="exam-notice" role="alert">${esc(state.notice)}</p>` : ''}${submitted ? `<section class="exam-result"><strong>已完成作答</strong></section><section class="exam-core"><h3>官方評分參考</h3><p>${esc(q.officialRubric || '本題依官方評分原則判定。')}</p>${q.suggestedFullScoreAnswer ? `<p>${esc(q.suggestedFullScoreAnswer)}</p>` : ''}</section>` : ''}</section>`; };
  const renderQuestion = (record) => { const q = record.question; const hasOptions = entries(q.options).length > 0; const state = hasOptions ? (quizState[record.id] || { selected: [], submitted: false }) : (constructedState[record.id] || { response: '', submitted: false }); const submitted = !!state.submitted; const optionList = hasOptions ? `<div class="exam-options" aria-label="${isMulti(record) ? '多選題選項' : '單選題選項'}">${renderOptions(record, state, submitted)}</div><div class="exam-controls"><button type="button" class="exam-submit" data-exam-submit ${submitted || !(state.selected || []).length ? 'disabled' : ''}>確認答案</button>${submitted ? '<button type="button" class="exam-reset" data-exam-reset>重新作答</button>' : ''}</div>${state.notice ? `<p class="exam-notice" role="alert">${esc(state.notice)}</p>` : ''}${submitted ? renderSubmitted(record, state) : ''}` : renderConstructed(record, state); return `<article class="exam-question-card" data-exam-question="${esc(record.id)}"><header><span>${record.year} Q${record.number || '—'}</span><span>第 ${record.group.items.indexOf(record) + 1} / ${record.group.items.length} 題</span></header>${renderMaterial(record)}${optionList}</article>`; };
  const renderGroupNav = (record) => record.group.items.map((item) => `<button type="button" class="exam-question-link ${item.id === record.id ? 'active' : ''}" data-exam-question="${esc(item.id)}">Q${item.number || '—'}</button>`).join('');
  const renderFromHash = () => { const target = currentRecord(); const mount = root(); if (!mount || !target) return; mount.innerHTML = `<section id="exam-view-root" class="exam-view" data-single-view="true"><header class="exam-header"><div><span class="eyebrow">歷屆試題模式</span><h2>${target.year} 年學測國語文</h2><p>以題組為單位閱讀，作答後才顯示答案與解析。</p></div><a class="button" href="#lesson-${String(target.lesson.number).padStart(2, '0')}-view-01">回課綱複習</a></header><nav class="exam-year-nav" aria-label="年度導覽">${[111,112,113,114,115].map((year) => `<button type="button" class="${year === target.year ? 'active' : ''}" data-exam-year="${year}">${year}</button>`).join('')}</nav><nav class="exam-question-nav" aria-label="本題組題目">${renderGroupNav(target)}</nav>${renderQuestion(target)}<nav class="exam-pager"><button type="button" data-exam-prev ${examQuestions.indexOf(target) <= 0 ? 'disabled' : ''}>← 上一題</button><span>${examQuestions.indexOf(target) + 1} / ${examQuestions.length}</span><button type="button" data-exam-next ${examQuestions.indexOf(target) >= examQuestions.length - 1 ? 'disabled' : ''}>下一題 →</button></nav></section>`; mount.dataset.mountedView = 'exam-view-root'; mount.dataset.mountedChildCount = '1'; requestAnimationFrame(() => mount.scrollIntoView({ behavior: 'smooth', block: 'start' })); };
  document.addEventListener('click', (event) => { const option = event.target.closest('[data-exam-option]'); const submit = event.target.closest('[data-exam-submit]'); const reset = event.target.closest('[data-exam-reset]'); const questionLink = event.target.closest('[data-exam-question]'); const year = event.target.closest('[data-exam-year]'); const prev = event.target.closest('[data-exam-prev]'); const next = event.target.closest('[data-exam-next]'); const record = currentRecord(); if (!record) return; const hasOptions = entries(record.question.options).length > 0; if (option && !option.disabled) { const state = quizState[record.id] || { selected: [], submitted: false }; let selected = isMulti(record) ? new Set(state.selected || []) : new Set(); if (isMulti(record)) selected.has(option.dataset.examOption) ? selected.delete(option.dataset.examOption) : selected.add(option.dataset.examOption); else { selected.clear(); selected.add(option.dataset.examOption); } quizState[record.id] = { selected: [...selected], submitted: false, notice: '' }; renderFromHash(); return; } if (submit && hasOptions) { const state = quizState[record.id] || { selected: [], submitted: false }; quizState[record.id] = state.selected?.length ? { ...state, submitted: true, notice: '' } : { ...state, notice: '請先選擇答案' }; renderFromHash(); return; } if (submit && !hasOptions) { const state = constructedState[record.id] || { response: '' }; constructedState[record.id] = state.response?.trim() ? { ...state, submitted: true, notice: '' } : { ...state, notice: '請先輸入作答內容' }; renderFromHash(); return; } if (reset) { delete quizState[record.id]; delete constructedState[record.id]; renderFromHash(); return; } if (questionLink) { const target = examQuestions.find((item) => item.id === questionLink.dataset.examQuestion); navigate(target); return; } if (year) { const target = examQuestions.find((item) => item.year === Number(year.dataset.examYear)); navigate(target); return; } const index = examQuestions.indexOf(record); if (prev && index > 0) navigate(examQuestions[index - 1]); if (next && index < examQuestions.length - 1) navigate(examQuestions[index + 1]); });
  document.addEventListener('input', (event) => { if (!event.target.matches('[data-exam-answer]')) return; const record = currentRecord(); if (record) constructedState[record.id] = { ...(constructedState[record.id] || {}), response: event.target.value, submitted: false, notice: '' }; });
  const isExamHash = () => location.hash.startsWith('#mode=exam');
  window.examRuntime = { renderFromHash, isExamHash, questions: examQuestions, canonicalReferenceCount: questions.length, groups, examIndex };
  window.addEventListener('hashchange', () => { if (isExamHash()) renderFromHash(); });
  if (isExamHash()) setTimeout(renderFromHash, 0);
})();
