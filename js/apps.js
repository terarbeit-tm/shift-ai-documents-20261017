/* 応用編の画面。選択肢の描画・選択状態の読み取り・まとめ表示・モーダル連携。
   プロンプトの生成は apps-build.js（画面に依存しない）、選択肢は apps-data.js。 */
(function () {
  'use strict';
  var data = window.APPS_DATA, build = window.AppsPrompt.build;
  var host = document.getElementById('ap-items');
  var target = document.getElementById('ap-target');
  var sumList = document.getElementById('ap-sum');
  var sumEmpty = document.getElementById('ap-sum-empty');
  var count = document.getElementById('ap-count');
  var openBtn = document.getElementById('ap-open');
  var hint = document.getElementById('ap-open-hint');
  var resetBtn = document.getElementById('ap-reset');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function termLink(id, label) {
    var a = el('a', 'ap-term', label || data.terms[id]);
    a.href = 'index.html#term-' + id;
    a.target = '_blank';
    a.rel = 'noopener';
    a.appendChild(el('span', 'ux-vh', '（用語集を新しいタブで開きます）'));
    return a;
  }

  /* 選択肢の色見本：swatch＝配色の小さな色のならび、mini＝見出し・リンク・ボタンの色の使い方のミニ見本（どちらも飾りなので読み上げない） */
  function swatchEl(o) {
    if (o && o.swatch) {
      var w = el('span', 'ap-sw');
      w.setAttribute('aria-hidden', 'true');
      o.swatch.forEach(function (c) { var i = el('i'); i.style.background = c; w.appendChild(i); });
      return w;
    }
    if (o && o.mini) {
      var m = el('span', 'ap-mini');
      m.setAttribute('aria-hidden', 'true');
      var h = el('i', 'h'), l = el('i', 'l'), b = el('i', 'b');
      h.style.background = o.mini.h; l.style.background = o.mini.l; b.style.background = o.mini.b;
      m.appendChild(h); m.appendChild(l); m.appendChild(b);
      return m;
    }
    return null;
  }

  function group(it, g) {
    var fs = el('fieldset', 'ap-group');
    var lg = el('legend', 'ap-group__legend', g.label);
    if (g.term) {
      lg.appendChild(document.createTextNode(' '));
      lg.appendChild(termLink(g.term, '用語集で見る'));
    }
    fs.appendChild(lg);
    var list = el('div', 'ap-opts');
    var name = it.id + '__' + g.id;
    if (g.type === 'radio') list.appendChild(opt(name, 'radio', '', 'おまかせ（指定しない）', true, g.auto));
    g.options.forEach(function (o) { list.appendChild(opt(name, g.type, o.id, o.label, false, o)); });
    fs.appendChild(list);
    return fs;
  }

  function opt(name, type, value, label, checked, o) {
    var l = el('label', 'ux-chip' + (type === 'radio' ? ' ux-chip--radio' : ''));
    var i = el('input');
    i.type = type === 'check' ? 'checkbox' : type; i.name = name; i.value = value; i.checked = checked;
    l.appendChild(i);
    var sw = swatchEl(o);
    if (sw) l.appendChild(sw);
    l.appendChild(el('span', 'ap-opt__label', label));
    return l;
  }

  /* ===== プレビュー（配色変更）：選んだ「配色の方向」と「色の使い方」を組み合わせて、ミニUIの色を切り替える ===== */
  function previewBox() {
    var box = el('div', 'ap-pvbox');
    box.appendChild(el('p', 'ap-pvbox__h', 'プレビュー（イメージ）'));
    var pv = el('div', 'ap-pv');
    pv.setAttribute('aria-hidden', 'true');
    pv.innerHTML = '<span class="ap-pv__tag">LABEL ラベル</span><b class="ap-pv__title">セクションタイトル</b>' +
      '<span class="ap-pv__sub">サブタイトルの文章がここに入ります。</span>' +
      '<span class="ap-pv__card"><b>カードの見出し</b><span>本文の例です。<span class="ap-pv__link">リンクの例</span></span></span>' +
      '<span class="ap-pv__btn">ボタン</span>';
    box.appendChild(pv);
    box.appendChild(el('p', 'ap-pvbox__note', '選ぶと、ここの色が切り替わります。実際の見た目は、選択肢と生成後の指示で決まります。'));
    return box;
  }

  function selectedOpt(card, it, gid) {
    var g = it.groups.filter(function (x) { return x.id === gid; })[0];
    var r = card.querySelector('input[name="' + it.id + '__' + gid + '"]:checked');
    var v = r ? r.value : '';
    var o = v ? g.options.filter(function (x) { return x.id === v; })[0] : g.auto;
    return o && o.preview ? o.preview : g.auto.preview;
  }

  function updatePreview(card, it) {
    var pv = card.querySelector('.ap-pv');
    if (!pv) return;
    var t = selectedOpt(card, it, 'direction'), u = selectedOpt(card, it, 'usage');
    var set = function (k, v) { pv.style.setProperty(k, v); };
    set('--pv-bg', t.bg); set('--pv-surface', t.surface); set('--pv-ink', t.ink); set('--pv-sub', t.sub);
    set('--pv-heading', t[u.heading]); set('--pv-link', t[u.link]); set('--pv-btn', t[u.button]); set('--pv-onbtn', t.onAccent); set('--pv-tag', t[u.label]);
  }

  data.items.forEach(function (it) {
    var card = el('div', 'ap-item');
    card.dataset.item = it.id;
    var head = el('label', 'ap-item__head');
    var chk = el('input', 'ap-item__chk');
    chk.type = 'checkbox';
    chk.id = 'ap-chk-' + it.id;
    var txt = el('span', 'ap-item__txt');
    txt.appendChild(el('span', 'ap-item__title', it.label));
    txt.appendChild(el('span', 'ap-item__desc', it.desc));
    head.appendChild(chk);
    head.appendChild(txt);
    card.appendChild(head);

    var terms = el('p', 'ap-item__terms', '関連用語：');
    it.terms.forEach(function (t, k) {
      if (k) terms.appendChild(document.createTextNode('・'));
      terms.appendChild(termLink(t));
    });
    card.appendChild(terms);

    var body = el('div', 'ap-item__body');
    body.hidden = true;
    body.id = 'ap-body-' + it.id;
    chk.setAttribute('aria-controls', body.id);
    it.groups.forEach(function (g) { body.appendChild(group(it, g)); });
    if (it.preview) { body.classList.add('ap-item__body--pv'); body.appendChild(previewBox()); }
    card.appendChild(body);
    host.appendChild(card);
  });

  function read() {
    var sel = { target: target.value, items: {} };
    data.items.forEach(function (it) {
      var card = host.querySelector('[data-item="' + it.id + '"]');
      if (!card.querySelector('.ap-item__chk').checked) return;
      var vals = {};
      it.groups.forEach(function (g) {
        var name = it.id + '__' + g.id;
        if (g.type === 'radio') {
          var r = card.querySelector('input[name="' + name + '"]:checked');
          if (r && r.value) vals[g.id] = r.value;
        } else {
          vals[g.id] = [].map.call(card.querySelectorAll('input[name="' + name + '"]:checked'), function (x) { return x.value; });
        }
      });
      sel.items[it.id] = vals;
    });
    return sel;
  }

  function labelsOf(it, vals) {
    var parts = [];
    it.groups.forEach(function (g) {
      var v = vals[g.id], ids = Array.isArray(v) ? v : (v ? [v] : []);
      var names = g.options.filter(function (o) { return ids.indexOf(o.id) >= 0; }).map(function (o) { return o.label; });
      if (names.length) parts.push(names.join('、'));
    });
    return parts.length ? parts.join(' ／ ') : 'おまかせ';
  }

  function update() {
    var sel = read();
    var chosen = data.items.filter(function (it) { return sel.items[it.id]; });
    data.items.forEach(function (it) {
      var card = host.querySelector('[data-item="' + it.id + '"]');
      var on = !!sel.items[it.id];
      card.classList.toggle('is-on', on);
      card.querySelector('.ap-item__body').hidden = !on;
      if (it.preview) updatePreview(card, it);
    });
    sumList.textContent = '';
    chosen.forEach(function (it) {
      var li = el('li');
      li.appendChild(el('b', '', it.label));
      li.appendChild(document.createTextNode('：' + labelsOf(it, sel.items[it.id])));
      sumList.appendChild(li);
    });
    sumEmpty.hidden = chosen.length > 0;
    count.textContent = chosen.length + '項目を選択中';
    openBtn.disabled = chosen.length === 0;
    hint.hidden = chosen.length > 0;
    return chosen.length;
  }

  host.addEventListener('change', update);
  target.addEventListener('input', update);

  openBtn.addEventListener('click', function () {
    var n = update();
    if (!n) return;
    var text = build(data, read());
    if (window.UXPromptModal) {
      window.UXPromptModal.open('Codex用プロンプト（' + n + '項目）', text, openBtn);
    } else {
      var fb = document.getElementById('ap-fb');
      document.getElementById('ap-fb-pre').textContent = text;
      fb.hidden = false;
      fb.scrollIntoView();
    }
  });

  document.getElementById('ap-fb-copy').addEventListener('click', function (e) {
    var t = document.getElementById('ap-fb-pre').textContent;
    window.UXCopy.copy(t).then(function (ok) { window.UXCopy.flash(e.target, ok); });
  });

  resetBtn.addEventListener('click', function () {
    target.value = '';
    [].forEach.call(host.querySelectorAll('input'), function (i) {
      i.checked = i.type === 'radio' && i.value === '';
    });
    update();
    host.querySelector('.ap-item__chk').focus();
  });

  update();
})();
