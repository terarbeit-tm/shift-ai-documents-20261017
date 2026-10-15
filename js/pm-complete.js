/* CP4「合宿完走！」ボタンと、お祝いモーダル。
   画像：images/bootcamp-complete.png（IMG）。X：PM_CONFIG.complete.xUrl（https）を加工せずそのまま新しいタブで開く（未設定は無効）。
   PC＝PNGをダウンロード／スマホ＝共有シート（対応端末）または原寸画像を新しいタブで開く。写真アプリへの直接保存は保証しない。 */
(function () {
  'use strict';
  var IMG = 'images/bootcamp-complete.png', NAME = 'bootcamp-complete.png';
  var open = document.getElementById('pm-complete-open');
  if (!open) return;
  var cfg = (window.PM_CONFIG && window.PM_CONFIG.complete) || {};
  var xUrl = /^https:\/\//.test(cfg.xUrl || '') ? cfg.xUrl : '';
  var mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var dlg, opener, file = null;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'pm-complete-modal';
    dlg.setAttribute('aria-labelledby', 'pm-complete-title');
    dlg.innerHTML =
      '<div class="pmc__head"><h2 class="pmc__title" id="pm-complete-title">🎉 合宿クリア！</h2>' +
      '<button type="button" class="pmc__close" data-pmc-close aria-label="閉じる">×</button></div>' +
      '<div class="pmc__body"><img class="pmc__img" src="' + IMG + '" alt="合宿完走の記念画像">' +
      '<p class="pmc__missing" hidden>記念画像は準備中です。</p>' +
      '<div class="pmc__actions">' +
      '<a class="ux-btn ux-btn--primary ux-btn--pill pmc__save" href="' + IMG + '" download="' + NAME + '">画像を保存</a>' +
      (xUrl
        ? '<a class="ux-btn ux-btn--pill pmc__x" target="_blank" rel="noopener noreferrer" href="#">Xでアウトプットする<span class="ux-vh">（新しいタブで開きます）</span></a>'
        : '<button type="button" class="ux-btn ux-btn--pill pmc__x" disabled>Xでアウトプットする（準備中）</button>') +
      '</div>' +
      '<p class="pmc__full"><a href="' + IMG + '" target="_blank" rel="noopener">原寸画像を新しいタブで開く</a></p>' +
      '<p class="pmc__hint" ' + (mobile ? '' : 'hidden') + '>画像を長押しして保存できます。iPhone：「“写真”に追加」／Android：「画像をダウンロード」。表示は端末やブラウザで異なり、写真アプリへの保存は保証できません。</p>' +
      '</div>';
    document.body.appendChild(dlg);
    var img = dlg.querySelector('.pmc__img'), save = dlg.querySelector('.pmc__save');
    var xa = dlg.querySelector('a.pmc__x');
    if (xa) xa.setAttribute('href', xUrl);
    img.addEventListener('error', function () {
      img.hidden = true;
      dlg.querySelector('.pmc__missing').hidden = false;
      save.setAttribute('aria-disabled', 'true'); save.removeAttribute('href'); save.removeAttribute('download');
      dlg.querySelector('.pmc__full').hidden = true;
    });
    if (mobile) {
      save.removeAttribute('download'); save.target = '_blank'; save.rel = 'noopener';
      save.addEventListener('click', function (e) {
        if (!file || !navigator.share || !navigator.canShare || !navigator.canShare({ files: [file] })) return;
        e.preventDefault();
        navigator.share({ files: [file], title: '合宿完走記念' }).catch(function () {});
      });
    }
    dlg.querySelector('[data-pmc-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      document.documentElement.classList.remove('pm-zoom-open');
      if (opener) opener.focus({ preventScroll: true });
    });
  }

  open.addEventListener('click', function () {
    if (!dlg) build();
    opener = open;
    if (mobile && !file && window.fetch) {
      fetch(IMG).then(function (r) { return r.blob(); })
        .then(function (b) { file = new File([b], NAME, { type: b.type || 'image/png' }); }).catch(function () {});
    }
    document.documentElement.classList.add('pm-zoom-open');
    dlg.showModal();
    dlg.querySelector('[data-pmc-close]').focus();
  });
})();
