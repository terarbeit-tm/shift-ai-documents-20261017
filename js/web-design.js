/* Webページ設計・UI/UXシート（講義のあと → 特設ページ応用）。
   5つの質問（選択式）から、AI向けの初期設計プロンプトを作る。コピーとMarkdown保存に対応。
   入力はブラウザ内だけで処理し、外部には送信しない。#wd-mount に描画する。 */
(function () {
  'use strict';
  var mount = document.getElementById('wd-mount');
  if (!mount) return;

  var QS = [
    { id: 'q1', title: 'どんなページを作る？', type: 'radio', init: 0, other: 4,
      opts: ['操作・手順ガイド', 'サービス紹介', 'LP・申込ページ', '情報まとめページ', 'その他'] },
    { id: 'q2', title: '誰が使う？', type: 'radio', init: 0,
      opts: ['初めて利用する人', '既存の会員・顧客', '社内の担当者', '一般の閲覧者'] },
    { id: 'q3', title: '何ができれば成功？', type: 'radio', init: 0,
      opts: ['迷わず手順を完了する', '申し込み・問い合わせする', '必要な情報を理解する', '目的の情報を探せる'] },
    { id: 'q4', title: '最初にどんな行動を取る？', type: 'radio', init: 0,
      opts: ['最初の手順へ進む', '資料・素材を入手する', '内容・選択肢を見る', '問い合わせ・申込へ進む'] },
    { id: 'q5', title: 'どこで迷いそう？（複数選べます）', type: 'check', init: [0],
      opts: ['手順や順番がわからない', '専門用語が難しい', 'スマホで使いにくい', '完了したか判断できない', '必要な情報が見つからない'] }
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function build() {
    var h = '<div class="wd-grid">' +
      '<div class="wd-q wd-q--wide"><label class="wd-q__t" for="wd-name">ページ名<span class="wd-q__opt">任意</span></label>' +
      '<input class="wd-input" id="wd-name" type="text" maxlength="60" autocomplete="off" placeholder="例：スライド作成ガイド"></div>';
    QS.forEach(function (q, qi) {
      var wide = q.id === 'q5' ? ' wd-q--wide' : '';
      h += '<fieldset class="wd-q' + wide + '"><legend class="wd-q__t"><span class="wd-q__n">Q' + (qi + 1) + '</span>' + esc(q.title) + '</legend><div class="wd-opts">';
      q.opts.forEach(function (o, i) {
        var on = q.type === 'radio' ? q.init === i : q.init.indexOf(i) >= 0;
        h += '<label class="wd-opt"><input type="' + (q.type === 'radio' ? 'radio' : 'checkbox') + '" name="wd-' + q.id + '" value="' + i + '"' + (on ? ' checked' : '') + '><span class="wd-opt__box" aria-hidden="true"></span><span class="wd-opt__tx">' + esc(o) + '</span></label>';
      });
      h += '</div>';
      if (q.other !== undefined) {
        h += '<div class="wd-other" id="wd-other-wrap" hidden><label class="wd-other__l" for="wd-other">「その他」の補足（短く）</label><input class="wd-input" id="wd-other" type="text" maxlength="60" autocomplete="off" placeholder="例：社内向けの申請ページ"></div>';
      }
      h += '</fieldset>';
    });
    h += '</div>' +
      '<div class="wd-out"><h4 class="wd-h">設計内容の確認</h4><dl class="wd-sum" id="wd-sum"></dl>' +
      '<h4 class="wd-h">AI向け初期設計プロンプト<span class="wd-q__opt">回答に合わせて自動で更新</span></h4>' +
      '<pre class="wd-pre" id="wd-pre" tabindex="0" aria-label="生成されたプロンプトのプレビュー"></pre>' +
      '<div class="wd-acts"><button type="button" class="ux-btn ux-btn--primary ux-btn--pill" id="wd-copy">プロンプトをコピー</button>' +
      '<button type="button" class="ux-btn ux-btn--pill" id="wd-dl">Markdownをダウンロード</button></div>' +
      '<p class="wd-status" id="wd-status" role="status" aria-live="polite"></p>' +
      '<p class="wd-note">入力内容はこのブラウザ内だけで処理され、外部には送信されません。</p></div>';
    mount.innerHTML = h;
  }

  function state() {
    var s = { name: '', ans: {}, q5: [] };
    s.name = (document.getElementById('wd-name').value || '').replace(/\s+/g, ' ').trim() || '名称未定';
    QS.forEach(function (q) {
      var els = mount.querySelectorAll('input[name="wd-' + q.id + '"]');
      if (q.type === 'radio') {
        for (var i = 0; i < els.length; i++) if (els[i].checked) s.ans[q.id] = q.opts[+els[i].value];
        if (q.id === 'q1' && s.ans.q1 === 'その他') {
          var t = (document.getElementById('wd-other').value || '').replace(/\s+/g, ' ').trim();
          s.ans.q1 = t ? 'その他（補足：' + t + '）' : 'その他（補足なし）';
        }
      } else {
        for (var j = 0; j < els.length; j++) if (els[j].checked) s.q5.push(q.opts[+els[j].value]);
      }
    });
    return s;
  }

  function prompt(s) {
    var q5 = s.q5.length ? s.q5.map(function (t) { return '・' + t; }) : ['未選択です。想定される課題を、AIから確認してください。'];
    return ['Webページの設計を手伝ってください。', '',
      '【ページ名】', s.name, '',
      '【ページの用途】', s.ans.q1, '',
      '【誰が使う？】', s.ans.q2, '',
      '【何ができれば成功？】', s.ans.q3, '',
      '【最初にどんな行動を取る？】', s.ans.q4, '',
      '【どこで迷いそう？】'].concat(q5, ['',
      '【完了をどう確認する？】',
      '目標を達成したことを利用者自身が判断できる方法を提案してください。', '',
      '上記をもとに、次の内容を提案してください。', '',
      '1. ページの目的と利用者像の整理',
      '2. 最初の行動から完了までの利用導線',
      '3. ページのセクション構成と各セクションの役割',
      '4. 迷いやすい部分への対策',
      '5. 完了条件と確認方法', '',
      '見た目の装飾より、使う人が迷わず目的を達成できることを優先してください。', '',
      '回答どうしに矛盾がありそうな場合は、推測で進めず、先に確認してください。',
      '不明な点は推測で埋めず、未確認としてください。', '',
      '今回は設計案の提示までにし、ファイル作成・実装・公開は行わないでください。私が確認してから次の作業に進んでください。']).join('\n');
  }

  function markdown(s, p) {
    return ['# Webページ設計・UI/UXシート', '',
      '## 設計情報', '',
      '- ページ名：' + s.name,
      '- ページの用途：' + s.ans.q1,
      '- 想定利用者：' + s.ans.q2,
      '- 成功条件：' + s.ans.q3,
      '- 最初の行動：' + s.ans.q4,
      '- 迷いやすい場所：' + (s.q5.length ? s.q5.join('、') : '未選択'), '',
      '## AIへの初期設計プロンプト', '',
      '```text', p, '```', '',
      '## 設計後の確認メモ', '',
      '- 確認したいこと：',
      '- 修正したいこと：', ''].join('\n');
  }

  function render() {
    var s = state(), p = prompt(s);
    document.getElementById('wd-other-wrap').hidden = !mount.querySelector('input[name="wd-q1"][value="4"]').checked;
    var rows = [['ページ名', s.name], ['ページの用途', s.ans.q1], ['想定利用者', s.ans.q2], ['成功条件', s.ans.q3],
      ['最初の行動', s.ans.q4], ['迷いやすい場所', s.q5.length ? s.q5.join('、') : '未選択']];
    document.getElementById('wd-sum').innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
    document.getElementById('wd-pre').textContent = p;
    return { s: s, p: p };
  }

  var timer;
  function say(msg, btn, label) {
    var st = document.getElementById('wd-status');
    st.textContent = msg;
    if (btn) btn.textContent = msg;
    clearTimeout(timer);
    timer = setTimeout(function () { st.textContent = ''; if (btn) btn.textContent = label; }, 2200);
  }

  build();
  render();
  mount.addEventListener('input', render);
  mount.addEventListener('change', render);

  document.getElementById('wd-copy').addEventListener('click', function () {
    var b = this, r = render();
    var done = function (ok) { say(ok ? 'コピーしました' : 'コピーできませんでした。プレビューを選択してコピーしてください。', ok ? b : null, 'プロンプトをコピー'); };
    if (window.UXCopy) window.UXCopy.copy(r.p).then(done); else done(false);
  });

  document.getElementById('wd-dl').addEventListener('click', function () {
    var r = render();
    var blob = new Blob([markdown(r.s, r.p)], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'web-page-design.md';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    say('web-page-design.md を保存しました', null, '');
  });

  window.WebDesignSheet = { build: function () { var r = render(); return { prompt: r.p, markdown: markdown(r.s, r.p) }; } };
})();
