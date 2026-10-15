/* 午後のワーク：初期HTMLのダウンロード案内。
   工程のサブタブ・直リンク（#cp1〜#cp4、#cp2-prompt など）・前後の工程への移動は subtabs.js が担当する。
   ダウンロード先のURLは js/pm-config.js で設定（https のみ有効）。 */
(function () {
  'use strict';
  var c = (window.PM_CONFIG && window.PM_CONFIG.startHtml) || {};
  var slot = document.querySelector('[data-start-slot]');
  var badge = document.querySelector('[data-start-badge]');
  var file = document.querySelector('[data-start-file]');
  if (!slot || !/^https:\/\//.test(c.url || '')) return;
  var a = document.createElement('a');
  a.className = 'ux-btn ux-btn--primary';
  a.href = c.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = '初期HTMLをダウンロード（新しいタブで開きます）';
  slot.textContent = '';
  slot.appendChild(a);
  if (badge) badge.hidden = true;
  if (file && c.fileName) { file.textContent = 'ファイル名：' + c.fileName; file.hidden = false; }
})();
