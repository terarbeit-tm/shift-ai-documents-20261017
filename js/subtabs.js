/* サブタブ（午前のワーク／午後のワーク／講義のあと）の共通処理と、メインタブ切替時のスクロール。
   nav.worksub 1つが1グループ。ボタンの data-sub が表示を切り替える対象の id（午前=s7〜s16、午後=cp1〜cp4、講義のあと=t3 と apps）。
   選んだ1つの内容だけを表示する（クラス sub-on）。本文・DOMは変えず、表示の切り替えだけを行う。JSが無い場合は、すべて縦に表示される。
   data-hash があるボタンは、URLにその値を使う（例：スライド作成応用 → #slides）。
   直リンク（#s9 / #work5 / #cp2 / #cp2-prompt / #apps など）は、メインタブを開いたあと（index.html のスクリプト）に、該当のサブタブを開いてからスクロールする。
   index.html のインラインスクリプト（メインタブ・route）のあとに読み込む。 */
(function () {
  'use strict';
  var root = document.documentElement;
  var navs = [].slice.call(document.querySelectorAll('nav.worksub'));
  var bar = document.querySelector('.tabbar');
  var mainIds = [].map.call(document.querySelectorAll('.tab[data-tab]'), function (b) { return b.dataset.tab; });
  if (!navs.length) return;
  root.classList.add('ws-js');

  var groups = navs.map(function (nav) {
    var btns = [].slice.call(nav.querySelectorAll('.worksub-btn'));
    var ids = btns.map(function (b) { return b.dataset.sub; });
    var panes = ids.map(function (id) { return document.getElementById(id); });
    var main = nav.closest('.panel');
    panes.forEach(function (p) { p.classList.add('sg-pane'); });
    return { nav: nav, btns: btns, ids: ids, panes: panes, main: main, current: null };
  });

  function isOn(g) { return g.main.classList.contains('on'); }
  function activeGroup() { return groups.filter(isOn)[0] || null; }
  function sticky(g) { return getComputedStyle(g.nav).position === 'sticky'; }

  /* サブタブの高さを --worksub-h に反映（表示中のグループのもの。固定されていなければ0） */
  function setOffsets() {
    var g = activeGroup();
    root.style.setProperty('--worksub-h', (g && sticky(g) ? g.nav.offsetHeight : 0) + 'px');
  }

  /* 固定されている領域（メインタブ・サブタブ）の下端 */
  function stack(g) {
    var navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 0;
    return navH + (bar ? bar.offsetHeight : 0) + (g && sticky(g) ? g.nav.offsetHeight : 0);
  }

  function smooth() { return window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth'; }

  /* 見出しが、固定領域の下で見える位置にあるか。見えなければスクロールする（再選択も同じ） */
  function reveal(head, s) {
    var top = head.getBoundingClientRect().top;
    if (top >= s + 8 && top <= window.innerHeight * 0.6) return;
    window.scrollTo({ top: Math.max(0, top + window.scrollY - s - 16), behavior: smooth() });
  }

  function headOf(pane) { return pane.querySelector('.chap-head, .pm-panel__head, .panel-head') || pane; }

  /* 切替カード（選択カード形式・固定しない）のグループは、カードが見える位置を先頭にする */
  function toHeading(g, pane) { reveal(g.nav.classList.contains('worksub--cards') ? g.nav : headOf(pane), stack(g)); }

  /* メインタブを切り替えたとき、そのタブの先頭（見出し）が、固定のメインタブの下に見えるようにする */
  function toPanel(id) {
    var p = document.querySelector('.panel[data-panel="' + id + '"]') || document.getElementById(id);
    if (!p) return;
    var cards = p.querySelector('.worksub--cards');
    var heads = [].slice.call(p.querySelectorAll('.panel-head')).filter(function (e) { return e.offsetParent !== null; });
    reveal(cards || heads[0] || p, bar ? bar.offsetHeight : 0);
  }

  function paneOf(g, el) {
    if (!el) return null;
    for (var i = 0; i < g.panes.length; i++) if (g.panes[i].contains(el)) return g.panes[i];
    return null;
  }

  function find(el) {
    for (var i = 0; i < groups.length; i++) {
      var p = paneOf(groups[i], el);
      if (p) return { g: groups[i], pane: p };
    }
    return null;
  }

  function select(g, id, opts) {
    opts = opts || {};
    if (g.ids.indexOf(id) < 0) id = g.ids[0];
    g.current = id;
    g.btns.forEach(function (b) {
      var on = b.dataset.sub === id;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    g.panes.forEach(function (c) {
      var on = c.id === id;
      c.classList.toggle('sub-on', on);
      if (on && c.tagName === 'DETAILS') c.open = true;
    });
    setOffsets();
    var btn = g.btns[g.ids.indexOf(id)];
    if (opts.url) history.replaceState(null, '', '#' + (btn.dataset.hash || id));
    if (opts.toTop) toHeading(g, document.getElementById(id));
  }

  function hashId() {
    try { return decodeURIComponent(location.hash.slice(1)); } catch (e) { return location.hash.slice(1); }
  }

  /* ハッシュに対応する表示にする。該当のメインタブが開いているときだけ動く */
  function route() {
    var h = hashId();
    var g, i;
    if (h && mainIds.indexOf(h) >= 0) {
      g = groups.filter(function (x) { return x.main.id === h || x.main.dataset.panel === h; })[0];
      if (g && !g.current) select(g, g.ids[0]);
      return;
    }
    if (h) {
      for (i = 0; i < groups.length; i++) {
        var k = groups[i].btns.map(function (b) { return b.dataset.hash; }).indexOf(h);
        if (k >= 0 && isOn(groups[i])) { select(groups[i], groups[i].ids[k]); toHeading(groups[i], document.getElementById(groups[i].ids[k])); return; }
      }
    }
    var el = h ? document.getElementById(h) : null;
    var hit = find(el);
    if (hit && isOn(hit.g)) {
      select(hit.g, hit.pane.id);
      if (el === hit.pane) toHeading(hit.g, hit.pane); else el.scrollIntoView();
    }
  }

  groups.forEach(function (g) {
    g.btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(g, b.dataset.sub, { url: true, toTop: true }); });
      b.addEventListener('keydown', function (e) {
        var n = g.btns.length, k = null;
        if (e.key === 'ArrowRight') k = (i + 1) % n;
        else if (e.key === 'ArrowLeft') k = (i - 1 + n) % n;
        else if (e.key === 'Home') k = 0;
        else if (e.key === 'End') k = n - 1;
        if (k === null) return;
        e.preventDefault();
        select(g, g.btns[k].dataset.sub, { url: true, toTop: true });
        g.btns[k].focus({ preventScroll: true });
      });
    });
    /* メインタブがこのグループに切り替わったとき、表示するサブタブが決まっていなければ先頭にする */
    new MutationObserver(function () {
      if (isOn(g) && !g.current) select(g, g.ids[0]);
      setOffsets();
    }).observe(g.main, { attributes: true, attributeFilter: ['class'] });
  });

  /* ページ内リンク（作業の目次・章末の「W3に戻る」・次の工程へ など）：別のサブタブへのリンクでも、開いてから移動する */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || mainIds.indexOf(id) >= 0) return;
    var el = document.getElementById(id);
    var hit = find(el);
    if (!hit) return;
    setTimeout(function () {
      select(hit.g, hit.pane.id, { url: false });
      if (el === hit.pane) toHeading(hit.g, hit.pane); else el.scrollIntoView();
      if (a.hasAttribute('data-goto')) { var h2 = hit.pane.querySelector('h2'); if (h2) h2.focus({ preventScroll: true }); }
    }, 0);
  });

  window.addEventListener('hashchange', function () { setTimeout(route, 0); });
  window.addEventListener('resize', setOffsets);

  groups.forEach(function (g) { select(g, g.ids[0]); });
  window.SiteNav = { toPanel: toPanel };
  route();
})();
