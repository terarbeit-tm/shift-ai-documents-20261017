/* チェックリスト（.ux-checklist）：チェックの件数を「3/5 確認済み」と表示する。
   チェック自体は、ふつうのチェックボックス（label で文章と関連付け済み）なので、JSが無くても切り替えられる。
   状態はページを開いている間だけ保持する（DOMの状態のまま。保存はしない）。全項目のチェックは強制しない。 */
(function () {
  'use strict';
  [].forEach.call(document.querySelectorAll('.ux-checklist'), function (list) {
    var boxes = [].slice.call(list.querySelectorAll('input[type="checkbox"]'));
    if (!boxes.length) return;
    var count = document.createElement('p');
    count.className = 'ux-checklist__count';
    count.setAttribute('role', 'status');
    count.setAttribute('aria-live', 'polite');
    list.parentNode.insertBefore(count, list);

    function update() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      count.textContent = '';
      var strong = document.createElement('strong');
      strong.textContent = n + '/' + boxes.length;
      count.appendChild(strong);
      count.appendChild(document.createTextNode(' 確認済み'));
      count.classList.toggle('is-done', n === boxes.length);
    }
    list.addEventListener('change', update);
    update();
  });
})();
