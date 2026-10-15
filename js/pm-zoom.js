/* 午後の完成イメージ画像：クリックで拡大表示。閉じるボタン・Esc・背景クリックで閉じ、開いた画像へフォーカスを戻す。 */
(function () {
  'use strict';
  var dlg, img, cap, opener;
  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'pm-zoom';
    dlg.setAttribute('aria-label', '画像の拡大表示');
    dlg.innerHTML = '<div class="pm-zoom__panel"><div class="pm-zoom__bar"><p class="pm-zoom__cap"></p>' +
      '<button type="button" class="ux-btn ux-btn--primary ux-btn--pill" data-zoom-close>閉じる</button></div>' +
      '<div class="pm-zoom__body"><img alt=""></div></div>';
    document.body.appendChild(dlg);
    img = dlg.querySelector('img');
    cap = dlg.querySelector('.pm-zoom__cap');
    dlg.querySelector('[data-zoom-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      document.documentElement.classList.remove('pm-zoom-open');
      if (opener) opener.focus({ preventScroll: true });
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.pm-shot__btn');
    if (!b) return;
    if (!dlg) build();
    var src = b.querySelector('img'), fc = b.parentNode.querySelector('figcaption');
    opener = b;
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = fc ? fc.textContent : '';
    document.documentElement.classList.add('pm-zoom-open');
    dlg.showModal();
    dlg.querySelector('[data-zoom-close]').focus();
  });
})();
