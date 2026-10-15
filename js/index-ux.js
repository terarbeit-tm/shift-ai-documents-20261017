/* index.html 用の補助：選択中のメインタブがスマホで画面外に出ないようにする。
   （4ページ間のサイトナビはメインタブに統合したため、--nav-h は常に0。サイトナビが残っている場合だけ高さを反映する）
   既存のスクリプトには触れず、後から重ねて動かす。 */
(function () {
  'use strict';
  var root = document.documentElement;
  var nav = document.querySelector('.ux-sitenav');
  var bar = document.querySelector('.tabbar');
  if (!bar) return;
  var mq = window.matchMedia('(min-width:721px)');

  function navH() { return nav && mq.matches ? nav.offsetHeight : 0; }
  function setNav() { root.style.setProperty('--nav-h', navH() + 'px'); }

  /* タブが6つになったので、選択中のタブがスマホの横スクロールの外に出ないようにする */
  var inner = bar.querySelector('.inner');
  function showActiveTab() {
    var on = bar.querySelector('.tab.on');
    if (!on || !inner || inner.scrollWidth <= inner.clientWidth) return;
    var left = on.offsetLeft - (inner.clientWidth - on.offsetWidth) / 2;
    inner.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }
  new MutationObserver(showActiveTab).observe(bar, { subtree: true, attributes: true, attributeFilter: ['class'] });
  showActiveTab();

  setNav();
  window.addEventListener('resize', setNav);
  if (mq.addEventListener) mq.addEventListener('change', setNav);
})();

/* 合言葉のコピー／イベントページURL（#after-event の data-event-url）が入ったらボタンをリンクにする */
(function () {
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy-text]');
    if (!b || !window.UXCopy) return;
    window.UXCopy.copy(b.dataset.copyText).then(function (ok) { window.UXCopy.flash(b, ok); });
  });
  var ev = document.getElementById('after-event');
  var th = ev && ev.querySelector('.after-thumb img');
  if (th) {
    var drop = function () { th.remove(); };
    if (th.complete && th.naturalWidth === 0 && th.getAttribute('src')) drop(); else th.addEventListener('error', drop);
  }
  var url = ev && ev.dataset.eventUrl;
  if (!/^https:\/\//.test(url || '')) return;
  var span = ev.querySelector('.after-btn.is-pending');
  var a = document.createElement('a');
  a.className = 'after-btn';
  a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
  a.textContent = 'イベントページを開く';
  span.replaceWith(a);
})();
