/* 用語集（メインタブ「07 用語集」）：用語カードの一覧（カテゴリ・検索）と、カードを押すと開く詳細モーダル。
   用語の本文・見本・指示例は、ページ内の <article class="gl-term"> をそのまま使う（JSが無い場合は、その一覧がそのまま表示される）。
   モーダルを開くときは、article の本文（.ux-card__body）をダイアログへ移し、閉じたら元に戻す。見本の動き（タブ等）は移しても保たれる。
   直リンク #term-xxx：開くと該当のモーダルが開く。履歴：カードで開くと履歴を1つ追加し、戻る・進むで閉じる・開く。 */
(function () {
  'use strict';
  var root = document.documentElement;
  var articles = [].slice.call(document.querySelectorAll('.gl-term'));
  var cardsHost = document.getElementById('gl-cards');
  var countEl = document.getElementById('gl-count');
  var emptyEl = document.getElementById('gl-empty');
  var chips = [].slice.call(document.querySelectorAll('.gl-chip'));
  var input = document.getElementById('gl-q');
  if (!articles.length || !cardsHost) return;
  root.classList.add('gl-js');

  var items = articles.map(function (a) {
    var key = a.id.replace(/^term-/, '');
    var name = a.querySelector('h3').textContent.trim();
    var en = (a.querySelector('.gl-en') || {}).textContent || '';
    var cat = a.dataset.cat;
    var summary = a.dataset.summary || '';
    return {
      key: key, el: a, name: name, en: en.trim(), cat: cat, summary: summary,
      hay: (name + ' ' + en + ' ' + cat + ' ' + summary + ' ' + a.querySelector('.ux-card__body').textContent).toLowerCase().replace(/\s+/g, ' ')
    };
  });

  /* ===== 一覧：カード ===== */
  items.forEach(function (it) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'gl-tcard';
    b.dataset.term = it.key;
    b.innerHTML = '<span class="gl-tcard__cat"></span><span class="gl-tcard__name"></span><span class="gl-tcard__en"></span><span class="gl-tcard__desc"></span><span class="gl-tcard__more" aria-hidden="true">詳しく見る →</span>';
    b.querySelector('.gl-tcard__cat').textContent = it.cat;
    b.querySelector('.gl-tcard__name').textContent = it.name;
    b.querySelector('.gl-tcard__en').textContent = it.en;
    b.querySelector('.gl-tcard__desc').textContent = it.summary;
    b.setAttribute('aria-label', it.name + '：' + it.summary + '　詳しく見る');
    b.addEventListener('click', function () { openTerm(it, b, true); });
    cardsHost.appendChild(b);
    it.card = b;
  });

  /* ===== カテゴリと検索（モーダルを閉じても状態は残る） ===== */
  var state = { cat: '', q: '' };
  function apply() {
    var q = state.q.trim().toLowerCase().replace(/\s+/g, ' ');
    var shown = 0;
    items.forEach(function (it) {
      var on = (!state.cat || it.cat === state.cat) && (!q || it.hay.indexOf(q) >= 0);
      it.card.hidden = !on;
      if (on) shown++;
    });
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.cat === state.cat)); });
    countEl.textContent = shown + '語を表示中';
    emptyEl.hidden = shown !== 0;
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { state.cat = c.dataset.cat; apply(); }); });
  input.addEventListener('input', function () { state.q = input.value; apply(); });

  /* ===== 詳細モーダル（ネイティブ dialog） ===== */
  var dlg = document.createElement('dialog');
  dlg.className = 'ux-modal gl-modal';
  dlg.setAttribute('aria-labelledby', 'gl-modal-title');
  dlg.innerHTML =
    '<div class="ux-modal__panel">' +
    '<div class="ux-modal__head gl-modal__head"><div class="gl-modal__titles"><p class="gl-modal__cat"></p><h2 class="ux-modal__title" id="gl-modal-title"></h2><p class="gl-modal__en"></p></div>' +
    '<button type="button" class="ux-modal__close" data-act="close" aria-label="閉じる">×</button></div>' +
    '<div class="gl-modal__body" tabindex="0"></div>' +
    '<div class="ux-modal__foot"><div class="ux-modal__actions"><button type="button" class="ux-btn ux-btn--pill" data-act="close">閉じる</button></div></div>' +
    '</div>';
  document.body.appendChild(dlg);
  var bodyHost = dlg.querySelector('.gl-modal__body');
  var current = null, opener = null, pushed = false, fromHistory = false, downOnBackdrop = false;
  var pendingBack = false, queued = null;   /* 閉じたときの history.back() が終わるまで、次のモーダルを開くのを待つ */

  function flush() {
    pendingBack = false;
    if (queued) { var q = queued; queued = null; openTerm(q.it, q.from, true); }
  }

  function openTerm(it, from, push) {
    if (pendingBack) { queued = { it: it, from: from }; return; }
    if (dlg.open) return;
    current = it;
    opener = from || it.card;
    dlg.querySelector('.gl-modal__cat').textContent = it.cat;
    dlg.querySelector('.ux-modal__title').textContent = it.name;
    dlg.querySelector('.gl-modal__en').textContent = it.en;
    bodyHost.appendChild(it.el.querySelector('.ux-card__body'));
    bodyHost.scrollTop = 0;
    if (push) { history.pushState({ term: it.key }, '', '#term-' + it.key); pushed = true; }
    var sbw = window.innerWidth - root.clientWidth;
    if (sbw > 0) root.style.setProperty('--ux-sbw', sbw + 'px');
    root.classList.add('ux-modal-open');
    dlg.showModal();
  }

  /* 閉じたあとの後始末。ボタン・背景・Esc・履歴のどれで閉じても同じ処理にし、続けて別の用語を開いても競合しないよう、同期的に行う */
  function cleanup() {
    if (!current) return;
    root.classList.remove('ux-modal-open');
    root.style.removeProperty('--ux-sbw');
    current.el.appendChild(bodyHost.querySelector('.ux-card__body'));
    var back = opener && !opener.hidden && document.contains(opener) ? opener : input;
    current = null; opener = null;
    back.focus();
    var byHistory = fromHistory;
    fromHistory = false;
    if (!byHistory) {
      if (pushed) { pushed = false; pendingBack = true; history.back(); setTimeout(function () { if (pendingBack) flush(); }, 3000); }
      else if (/^#term-/.test(location.hash)) history.replaceState(null, '', '#tg');
    }
  }
  function closeModal() { if (dlg.open) dlg.close(); cleanup(); }
  dlg.addEventListener('close', cleanup);
  [].forEach.call(dlg.querySelectorAll('[data-act="close"]'), function (b) { b.addEventListener('click', closeModal); });
  dlg.addEventListener('pointerdown', function (e) { downOnBackdrop = e.target === dlg; });
  dlg.addEventListener('click', function (e) { if (e.target === dlg && downOnBackdrop) closeModal(); downOnBackdrop = false; });

  /* ===== 直リンク・戻る／進む ===== */
  function byHash() {
    var m = /^#term-(.+)$/.exec(decodeURIComponent(location.hash));
    if (!m) return null;
    return items.filter(function (it) { return it.key === m[1]; })[0] || null;
  }
  function route() {
    var it = byHash();
    var ours = !!(it && history.state && history.state.term === it.key);   /* 自分で積んだ履歴（戻る・進む）なら、閉じるときも戻る */
    if (it && !dlg.open) { pushed = ours; openTerm(it, it.card, false); }
    else if (it && dlg.open && current !== it) { fromHistory = true; pushed = false; closeModal(); openTerm(it, it.card, false); }
    else if (!it && dlg.open) { fromHistory = true; pushed = false; closeModal(); }
  }
  window.addEventListener('hashchange', function () { if (pendingBack) { flush(); return; } route(); });

  /* ===== 表示見本：タブ ===== */
  [].forEach.call(document.querySelectorAll('[data-demo-tabs]'), function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]'));
    var panels = [].slice.call(box.querySelectorAll('[role="tabpanel"]'));
    function show(i) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var k = null, n = tabs.length;
        if (e.key === 'ArrowRight') k = (i + 1) % n;
        else if (e.key === 'ArrowLeft') k = (i - 1 + n) % n;
        if (k === null) return;
        e.preventDefault();
        show(k);
        tabs[k].focus();
      });
    });
  });

  /* ===== 表示見本：モーダル（見本の枠の中だけで開閉する。本物のダイアログを重ねない） ===== */
  [].forEach.call(document.querySelectorAll('[data-mini]'), function (box) {
    var layer = box.querySelector('[data-mini-layer]');
    var openBtn = box.querySelector('[data-mini-open]');
    var closeBtn = box.querySelector('[data-mini-close]');
    function close() { layer.hidden = true; openBtn.focus(); }
    openBtn.addEventListener('click', function () { layer.hidden = false; closeBtn.focus(); });
    closeBtn.addEventListener('click', close);
    layer.addEventListener('click', function (e) { if (e.target === layer) close(); });
  });

  apply();
  route();
})();
