/* 応用編：選択結果 → Codex用プロンプトの生成（画面に依存しない純粋関数。Nodeでテストできる）
   sel = { target: string, items: { <itemId>: { <groupId>: <optionId> | [<optionId>, ...] } } }
   項目が1つも選ばれていなければ '' を返す。 */
(function (root) {
  'use strict';

  function pick(group, value) {
    var ids = Array.isArray(value) ? value : (value ? [value] : []);
    return group.options.filter(function (o) { return ids.indexOf(o.id) >= 0; });
  }

  function build(data, sel) {
    var chosen = data.items.filter(function (it) { return sel && sel.items && sel.items[it.id]; });
    if (!chosen.length) return '';
    var out = [data.intro, '', '【対象】', (sel.target || '').trim() || data.defaultTarget, '', '【改善する項目】'];
    chosen.forEach(function (it, i) {
      var vals = sel.items[it.id] || {};
      out.push((i + 1) + '. ' + it.label, it.intro);
      var lines = [];
      it.groups.forEach(function (g) {
        var opts = pick(g, vals[g.id]);
        if (g.type === 'radio') opts = opts.slice(0, 1);
        if (opts.length) lines.push('- ' + g.label.replace(/（複数選べます）/, '') + '：' + opts.map(function (o) { return o.text; }).join('／'));
      });
      if (!lines.length) lines.push('- ' + data.undecided);
      (it.rules || []).forEach(function (r) { lines.push('- 注意：' + r); });
      out.push.apply(out, lines);
      out.push('');
    });
    out.push('【必ず守る条件】');
    data.keep.forEach(function (k) { out.push('- ' + k); });
    out.push('', '【進め方】');
    data.steps.forEach(function (s, i) { out.push((i + 1) + '. ' + s); });
    return out.join('\n');
  }

  var api = { build: build };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AppsPrompt = api;
})(typeof window !== 'undefined' ? window : globalThis);
