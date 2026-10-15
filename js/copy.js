/* コピー処理（新ページ・モーダル共通）。index.html 内の既存コピー処理には触れない。
   - UXCopy.copy(text)       文字列をそのままコピー（加工しない）。成否を Promise<boolean> で返す
   - UXCopy.textOf(container) container のプロンプト本文。data-prompt-id があれば window.UXPromptData[id].text、無ければ内の pre.copy / pre.ux-prompt__src の textContent
     UXPromptData の text が null・空なら未設定（''）として扱う
   - [data-prompt-copy] ボタン：同じ [data-prompt] 内の本文を、開かずにコピー */
(function () {
  'use strict';

  function legacyCopy(text) {
    var host = document.querySelector('dialog[open]') || document.body;
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    host.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    host.removeChild(ta);
    return ok;
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; },
        function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function dataOf(id) {
    var d = window.UXPromptData && window.UXPromptData[id];
    return d && typeof d.text === 'string' && d.text !== '' ? d.text : '';
  }

  function textOf(container) {
    if (container.dataset.promptId) return dataOf(container.dataset.promptId);
    var pre = container.querySelector('pre.copy, pre.ux-prompt__src');
    return pre ? pre.textContent : '';
  }

  var live;
  function announce(msg) {
    if (!live) {
      live = document.createElement('div');
      live.className = 'ux-vh';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      document.body.appendChild(live);
    }
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 30);
  }

  function flash(btn, ok) {
    var label = btn.dataset.label || (btn.dataset.label = btn.textContent);
    clearTimeout(btn._t);
    btn.textContent = ok ? 'コピーしました' : 'コピーできませんでした';
    btn.classList.toggle('is-done', ok);
    announce(btn.textContent);
    btn._t = setTimeout(function () { btn.textContent = label; btn.classList.remove('is-done'); }, 1800);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-prompt-copy]');
    if (!btn) return;
    var box = btn.closest('[data-prompt]');
    if (!box) return;
    var text = textOf(box);
    if (!text) return;
    copy(text).then(function (ok) { flash(btn, ok); });
  });

  window.UXCopy = { copy: copy, textOf: textOf, dataOf: dataOf, announce: announce, flash: flash };
})();
