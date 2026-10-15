/* プロンプトのモーダル（ネイティブ <dialog>、ライブラリなし）。要 copy.js / modal.css
   開き方は3通り
   1) [data-prompt] 内の [data-prompt-open]（新ページ）。本文は data-prompt-id なら window.UXPromptData[id].text、
      無ければ同じ要素内の pre.ux-prompt__src。未設定（null・空）のボタンは無効化して開けない
   2) 午前の既存マークアップ：.prompt-details > summary のクリックを横取り。本文は同じ .copywrap の pre.copy
      （DOMは変更しない。JSが動かなければ従来どおり <details> が開く）
   3) window.UXPromptModal.open(title, text, openerEl)（応用編など、本文を実行時に作る場合）
   ダイアログはページに1つだけ。開くたびにタイトルと本文を差し替える。表示・コピーとも本文をそのまま使う。 */
(function () {
  'use strict';
  if (typeof HTMLDialogElement !== 'function') return;

  var root = document.documentElement;
  root.classList.add('ux-js');

  var dlg, titleEl, bodyEl, statusEl, copyBtn;
  var opener = null, current = '', downOnBackdrop = false, statusTimer;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'ux-modal';
    dlg.setAttribute('aria-labelledby', 'ux-modal-title');
    dlg.innerHTML =
      '<div class="ux-modal__panel">' +
      '<div class="ux-modal__head"><h2 class="ux-modal__title" id="ux-modal-title"></h2>' +
      '<button type="button" class="ux-modal__close" data-act="close" aria-label="閉じる">×</button></div>' +
      '<pre class="ux-modal__body" tabindex="0" aria-label="プロンプト全文"></pre>' +
      '<div class="ux-modal__foot"><p class="ux-modal__status" role="status" aria-live="polite"></p>' +
      '<div class="ux-modal__actions">' +
      '<button type="button" class="ux-btn ux-btn--primary ux-btn--pill" data-act="copy">全文をコピー</button>' +
      '<button type="button" class="ux-btn ux-btn--pill" data-act="close">閉じる</button></div></div></div>';
    document.body.appendChild(dlg);
    titleEl = dlg.querySelector('.ux-modal__title');
    bodyEl = dlg.querySelector('.ux-modal__body');
    statusEl = dlg.querySelector('.ux-modal__status');
    copyBtn = dlg.querySelector('[data-act="copy"]');

    copyBtn.addEventListener('click', onCopy);
    [].forEach.call(dlg.querySelectorAll('[data-act="close"]'), function (b) {
      b.addEventListener('click', function () { dlg.close(); });
    });
    dlg.addEventListener('pointerdown', function (e) { downOnBackdrop = e.target === dlg; });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg && downOnBackdrop) dlg.close();
      downOnBackdrop = false;
    });
    dlg.addEventListener('close', onClose);
  }

  function resetCopy() {
    copyBtn.classList.remove('is-done');
    copyBtn.textContent = '全文をコピー';
  }

  function say(msg) {
    statusEl.textContent = msg;
    clearTimeout(statusTimer);
    if (msg) statusTimer = setTimeout(function () { statusEl.textContent = ''; resetCopy(); }, 4000);
  }

  function onCopy() {
    window.UXCopy.copy(current).then(function (ok) {
      if (ok) {
        copyBtn.classList.add('is-done');
        copyBtn.textContent = 'コピーしました';
        say('全文をコピーしました。Codexに貼り付けてください。');
      } else {
        var r = document.createRange();
        r.selectNodeContents(bodyEl);
        var s = getSelection();
        s.removeAllRanges();
        s.addRange(r);
        bodyEl.focus();
        say('自動でコピーできませんでした。全文を選択したので、Ctrl+C（Macは⌘+C）でコピーしてください。');
      }
    });
  }

  function onClose() {
    root.classList.remove('ux-modal-open');
    root.style.removeProperty('--ux-sbw');
    bodyEl.textContent = '';
    current = '';
    say('');
    resetCopy();
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  }

  function open(title, text, from) {
    if (!text) return;
    if (!dlg) build();
    if (dlg.open) return;
    opener = from || document.activeElement;
    current = text;
    titleEl.textContent = title || 'プロンプト';
    bodyEl.textContent = text;
    bodyEl.scrollTop = 0;
    say('');
    resetCopy();
    var sbw = window.innerWidth - root.clientWidth;
    if (sbw > 0) root.style.setProperty('--ux-sbw', sbw + 'px');
    root.classList.add('ux-modal-open');
    dlg.showModal();
    copyBtn.focus();
  }

  function markPending() {
    [].forEach.call(document.querySelectorAll('[data-prompt][data-prompt-id]'), function (box) {
      var has = !!window.UXCopy.textOf(box);
      var btn = box.querySelector('[data-prompt-open]');
      var badge = box.querySelector('[data-pending-badge]');
      box.classList.toggle('is-pending', !has);
      if (badge) badge.hidden = has;
      if (btn) {
        if (!btn.dataset.label) btn.dataset.label = btn.textContent;
        btn.disabled = !has;
        btn.textContent = has ? btn.dataset.label : '準備中（開けません）';
      }
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-prompt-open]');
    if (btn) {
      var box = btn.closest('[data-prompt]');
      if (!box) return;
      var label = box.querySelector('.ux-prompt__label');
      open(box.dataset.promptTitle || (label && label.textContent), window.UXCopy.textOf(box), btn);
      return;
    }
    var sum = e.target.closest('.prompt-details > summary');
    if (sum) {
      var wrap = sum.closest('.copywrap');
      var pre = wrap && wrap.querySelector('pre.copy');
      if (!pre) return;
      e.preventDefault();
      var fn = wrap.querySelector('.fn');
      open(fn && fn.textContent, pre.textContent, sum);
    }
  });

  /* 午前の「プロンプトを開く」：画面には出さないタイトル（.fn）を、ボタンの読み上げ名に含める */
  [].forEach.call(document.querySelectorAll('.prompt-details > summary'), function (sum) {
    var fn = sum.closest('.copywrap') && sum.closest('.copywrap').querySelector('.fn');
    if (fn && fn.textContent.trim()) sum.setAttribute('aria-label', sum.textContent.trim() + '：' + fn.textContent.trim());
  });

  markPending();
  window.UXPromptModal = { open: open, refresh: markPending };
})();
