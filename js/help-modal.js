/* 「講師と違う画面が出たら」：工程別の相談プロンプトを作るモーダル（全メインタブから使える）。
   工程名・目的・完成の目安は、固定の文章を持たず、ページ内の教材（午前＝W1〜W5のゴール／午後＝準備・CP1〜CP4の内容と到達チェック）から読み取る。
   読み取れない項目は書かない（推測で補わない）。 */
(function () {
  'use strict';
  var btn = document.getElementById('help-open');
  if (!btn) return;
  var DEFAULT_STATUS = '添付したスクリーンショットの状態になり、次にどう進めればよいかわからなくなりました。';

  var PARTS = [
    { id: 'am', label: '午前のワーク', panel: 't2', stages: ['s7', 's8', 's9', 's10', 's18'] },
    { id: 'pm', label: '午後のワーク', panel: 'tpm', stages: ['start', 'cp1', 'cp2', 'cp3', 'cp4'] }
  ];

  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function checks(sel) {
    return [].map.call(document.querySelectorAll(sel), txt).filter(Boolean);
  }

  /* 工程の情報をページから読み取る：{ short（ボタン名）, name（工程名）, aim（目指していること）[行の配列] } */
  function stageInfo(id) {
    var sec = document.getElementById(id), info = { short: '', name: '', aim: [] };
    if (!sec) return info;
    if (/^s\d+$/.test(id)) {
      var no = txt(sec.querySelector('.chap-head .no')), title = txt(sec.querySelector('.chap-head h3'));
      var cal = sec.querySelector('.callout.ok');
      var goal = '';
      if (cal) { var c = cal.cloneNode(true), ct = c.querySelector('.ct'); if (ct) ct.remove(); goal = txt(c); }
      info.short = no;
      info.name = no + '：' + title;
      if (goal) info.aim.push('ゴール：' + goal);
    } else if (id === 'start') {
      var card = document.getElementById('start-h').closest('.pm-card');
      var h = txt(document.querySelector('#start-h .ux-step__title'));
      var lead = txt(card.querySelector('.ux-step__body > p'));
      info.short = '準備';
      info.name = '準備：' + h;
      if (lead) info.aim.push(lead);
      var ck = checks('#start-check .ux-check__text');
      if (ck.length) { info.aim.push('完成の目安（到達チェック）：'); ck.forEach(function (t) { info.aim.push('・' + t); }); }
    } else {
      var n = id.replace('cp', '');
      var h2 = txt(sec.querySelector('.pm-panel__head h2'));
      info.short = 'CP' + n;
      info.name = 'CP' + n + '：' + h2;
      var what = txt(document.querySelector('#' + id + '-what .ux-step__body'));
      if (what) info.aim.push('改善する内容：' + what);
      var ck2 = checks('#' + id + '-check .ux-check__text');
      if (ck2.length) { info.aim.push('完成の目安（到達チェック）：'); ck2.forEach(function (t) { info.aim.push('・' + t); }); }
    }
    return info;
  }

  function buildPrompt(part, stage, status) {
    var s = stageInfo(stage);
    var lines = [
      '10月17日の資料作成実践合宿に参加しています。', '',
      '【取り組んでいる工程】', part.label + '／' + s.name, ''
    ];
    if (s.aim.length) { lines.push('【この工程で目指していること】'); lines = lines.concat(s.aim); lines.push(''); }
    lines = lines.concat([
      '【現在の状況】', status || DEFAULT_STATUS, '',
      '現在の画面のスクリーンショットを添付します。', '',
      'スクリーンショットと上記の情報から、現在の状態を確認してください。', '',
      '講師の画面や詳しい操作手順は共有されていないため、推測で断定しないでください。', '',
      '原因がわかれば、元のファイルや設定を壊さない対処を初心者向けに1ステップずつ案内してください。', '',
      '判断に必要な情報が足りなければ、最初に確認事項を1つだけ質問してください。', '',
      'ファイルの削除・上書きや公開設定の変更は、私の確認なしに行わないでください。'
    ]);
    return lines.join('\n');
  }

  var dlg, partBtns, stageHost, status, preview, copyBtn, state = { part: 0, stage: null }, opener;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'help-modal';
    dlg.setAttribute('aria-labelledby', 'help-title');
    dlg.innerHTML =
      '<div class="hm__head"><h2 class="hm__title" id="help-title">講師と違う画面が出たら</h2>' +
      '<button type="button" class="hm__close" data-hm-close aria-label="閉じる">×</button></div>' +
      '<div class="hm__body">' +
      '<p class="hm__lead">いま取り組んでいる工程を選ぶと、ChatGPT / Geminiに相談するための文章ができます。</p>' +
      '<p class="hm__lb" id="hm-lb-part">1. 午前・午後を選ぶ</p><div class="hm__parts" role="tablist" aria-labelledby="hm-lb-part"></div>' +
      '<p class="hm__lb" id="hm-lb-stage">2. 取り組んでいる工程を選ぶ</p><div class="hm__stages" role="group" aria-labelledby="hm-lb-stage"></div>' +
      '<label class="hm__lb" for="hm-status">3. 現在の状況（任意）</label>' +
      '<textarea id="hm-status" class="hm__status" rows="3" placeholder="例：タブを押しても画面が変わりません"></textarea>' +
      '<div class="hm__prevhead"><p class="hm__lb" id="hm-lb-prev">4. 相談文（自動で更新されます）</p>' +
      '<button type="button" class="ux-btn ux-btn--primary ux-btn--pill hm__copy">全文をコピー</button></div>' +
      '<pre class="hm__preview" tabindex="0" aria-labelledby="hm-lb-prev"></pre>' +
      '<div class="hm__guide"><p><b>コピーした相談文と、現在の画面のスクリーンショットをChatGPTまたはGeminiに一緒に送ってください。</b></p>' +
      '<p class="hm__lb2">スクリーンショットの撮り方</p>' +
      '<ul class="hm__keys"><li><span>Windows</span><code>Windows + Shift + S</code></li><li><span>Mac</span><code>Command + Shift + 4</code></li></ul>' +
      '<p class="hm__warn">パスワード、APIキー、個人情報などが写っている場合は、隠してから送ってください。</p></div>' +
      '</div>';
    document.body.appendChild(dlg);
    partBtns = [];
    var partsHost = dlg.querySelector('.hm__parts');
    PARTS.forEach(function (p, i) {
      var b = el('button', 'hm__part', p.label);
      b.type = 'button'; b.setAttribute('role', 'tab');
      b.addEventListener('click', function () { setPart(i); });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var k = (i + 1) % PARTS.length;
        e.preventDefault(); setPart(k); partBtns[k].focus();
      });
      partsHost.appendChild(b); partBtns.push(b);
    });
    stageHost = dlg.querySelector('.hm__stages');
    status = dlg.querySelector('.hm__status');
    preview = dlg.querySelector('.hm__preview');
    copyBtn = dlg.querySelector('.hm__copy');
    status.addEventListener('input', render);
    copyBtn.addEventListener('click', function () {
      window.UXCopy.copy(preview.textContent).then(function (ok) { window.UXCopy.flash(copyBtn, ok); });
    });
    dlg.querySelector('[data-hm-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      document.documentElement.classList.remove('pm-zoom-open');
      if (opener) opener.focus({ preventScroll: true });
    });
  }

  function setPart(i, stage) {
    state.part = i;
    partBtns.forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    stageHost.textContent = '';
    PARTS[i].stages.forEach(function (id) {
      var info = stageInfo(id);
      var b = el('button', 'hm__stage', info.short || id);
      b.type = 'button'; b.dataset.stage = id;
      b.addEventListener('click', function () { setStage(id); });
      stageHost.appendChild(b);
    });
    setStage(stage || PARTS[i].stages[0]);
  }

  function setStage(id) {
    state.stage = id;
    [].forEach.call(stageHost.children, function (b) {
      var on = b.dataset.stage === id;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
    });
    render();
  }

  function render() {
    preview.textContent = buildPrompt(PARTS[state.part], state.stage, status.value.trim());
  }

  /* 開いたときの初期選択：午後のメインタブなら午後、それ以外は午前。表示中のサブタブが対象の工程なら、それを選ぶ */
  function initial() {
    var on = document.querySelector('.panel.on');
    var pi = on && on.id === 'tpm' ? 1 : 0, stage = null;
    if (on && on.id === PARTS[pi].panel) {
      var sb = on.querySelector('.worksub-btn.on');
      if (sb && PARTS[pi].stages.indexOf(sb.dataset.sub) >= 0) stage = sb.dataset.sub;
    }
    return { part: pi, stage: stage };
  }

  btn.addEventListener('click', function () {
    if (!dlg) build();
    opener = btn;
    status.value = '';
    var s = initial();
    setPart(s.part, s.stage);
    document.documentElement.classList.add('pm-zoom-open');
    dlg.showModal();
    dlg.querySelector('[data-hm-close]').focus();
  });
})();
