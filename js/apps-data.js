/* 応用編：選択肢とプロンプト断片のデータ。項目・選択肢を足すときは、このファイルだけを編集する。
   items[].groups[].options[].text が、プロンプトに入る文言（句点なしの句）。label は画面表示用。
   terms の id は用語集（index.html の #term-<id>）に対応する。 */
window.APPS_DATA = {
  defaultTarget: 'このフォルダーにある、いま開いているHTMLページ',
  intro: '既存のWebページを改善してください。新しく作り直さず、いまのページに手を入れる形でお願いします。',
  keep: [
    '既存の文章・見出し・説明文は変えない（誤字の修正もしない）',
    'リンク先・画像・配布ファイルは変えない',
    '既存の機能（タブ・コピー・ダウンロード・直リンクなど）は、そのまま動くようにする',
    '変えるのは見た目と操作性だけにする。選んだ項目以外には手を付けない'
  ],
  steps: [
    'まず、現在のページの構成を読み取り、変更計画を5行以内で示してください。',
    '私が「進めて」と返したら、変更を実装してください。',
    '実装後、変更したファイルと変更箇所を一覧にしてください。',
    '最後に、文章・リンク・機能が変わっていないことを確認し、確認できなかった点があれば教えてください。'
  ],
  undecided: '方法の指定なし：目的に合う方法を提案してください',
  terms: {
    'accent-color': 'アクセントカラー', columns: '1カラム／2カラム', whitespace: '余白', mockup: 'モックアップ',
    responsive: 'レスポンシブ', navigation: 'ナビゲーション', accordion: 'アコーディオン', steps: 'ステップ表示・チェックリスト'
  },
  items: [
    {
      id: 'color', label: '配色変更', desc: 'ページ全体の色づかいを変えます。', terms: ['accent-color'], preview: 'color',
      intro: '配色を見直してください。文字と背景の明暗差を確保し、読みやすさを最優先にしてください。',
      /* swatch：選択肢の色見本（画面表示用）／preview：右のプレビューに使う色（bg 地・surface カード・ink 文字・sub 補助文字・accent/accent2/accent3 の3つの強調色・tint ラベル地・onAccent ボタンの文字色）
         usage の preview：見出し・リンク・ボタン・ラベルに、上の色のどれを使うか */
      groups: [
        { id: 'direction', label: '配色の方向', type: 'radio', term: 'accent-color',
          auto: { swatch: ['#FFFFFF', '#E3E6E8', '#5F6B76'], preview: { bg: '#FFFFFF', surface: '#F4F5F6', ink: '#2F3437', sub: '#6B7378', accent: '#5F6B76', accent2: '#2F3437', accent3: '#7A8590', tint: '#E3E6E8', onAccent: '#FFFFFF' } },
          options: [
          { id: 'keep', label: '今の配色を保ち、強調色だけ整える', text: '今の配色を保ち、強調色（ボタン・リンク・見出しの印）だけを整える',
            swatch: ['#FFF8F2', '#F25C00', '#292521'], preview: { bg: '#FFF8F2', surface: '#FFFFFF', ink: '#292521', sub: '#655A51', accent: '#F25C00', accent2: '#292521', accent3: '#BF4900', tint: '#FFF0E4', onAccent: '#FFFFFF' } },
          { id: 'calm', label: '落ち着いた配色（青・グレー系）', text: '落ち着いた配色（青とグレーを基調）に変える',
            swatch: ['#1F3A5F', '#6F8FB0', '#EEF2F7', '#FFFFFF'], preview: { bg: '#EEF2F7', surface: '#FFFFFF', ink: '#1F2A44', sub: '#5B6B80', accent: '#2F5D9E', accent2: '#1F3A5F', accent3: '#2B7A8C', tint: '#DCE5F0', onAccent: '#FFFFFF' } },
          { id: 'warm', label: 'あたたかい配色（オレンジ・ベージュ系）', text: 'あたたかい配色（オレンジとベージュを基調）に変える',
            swatch: ['#F25C00', '#FFB36B', '#F3E3CF', '#FFF6EA'], preview: { bg: '#FFF1DF', surface: '#FFFAF2', ink: '#2B2B2B', sub: '#6A5F55', accent: '#F25C00', accent2: '#C84A00', accent3: '#E07A1F', tint: '#FFE0BD', onAccent: '#FFFFFF' } },
          { id: 'dark', label: 'ダーク系の配色', text: '暗い背景に明るい文字のダーク系の配色に変える',
            swatch: ['#1F2328', '#3A4048', '#9AA4AF', '#FF8A3D'], preview: { bg: '#1F2328', surface: '#2B3138', ink: '#F2F4F7', sub: '#9AA4AF', accent: '#FF8A3D', accent2: '#F2F4F7', accent3: '#7FC8F8', tint: '#3A4048', onAccent: '#1F2328' } }
        ] },
        { id: 'usage', label: '色の使い方', type: 'radio',
          auto: { mini: { h: '#2F3437', l: '#5F6B76', b: '#5F6B76' }, preview: { heading: 'accent2', link: 'accent', button: 'accent', label: 'tint' } },
          options: [
          { id: 'one', label: 'アクセントは1色だけ', text: 'アクセントカラーは1色だけにし、強調したい所以外には使わない',
            mini: { h: '#292521', l: '#292521', b: '#F25C00' }, preview: { heading: 'ink', link: 'ink', button: 'accent', label: 'tint' } },
          { id: 'roles', label: 'ボタン・リンク・見出しで使い分ける', text: 'ボタン・リンク・見出しの色を役割ごとに決め、同じ役割は同じ色にする',
            mini: { h: '#1F3A5F', l: '#1E8A7A', b: '#F25C00' }, preview: { heading: 'accent2', link: 'accent3', button: 'accent', label: 'tint' } }
        ] }
      ]
    },
    {
      id: 'layout', label: 'レイアウト変更', desc: 'ページの並べ方（列の数・余白）を変えます。', terms: ['columns', 'whitespace'],
      intro: 'ページの並べ方を見直してください。',
      groups: [
        { id: 'columns', label: '列の構成', type: 'radio', term: 'columns', options: [
          { id: 'one', label: '1カラム（縦一列）', text: '本文を1カラム（縦一列）で読ませる構成にする' },
          { id: 'two', label: '2カラム（本文＋横の目次）', text: 'PCでは2カラム（本文と、横に固定した目次）にし、スマホでは1カラムに戻す' },
          { id: 'cards', label: 'カードを2〜3列に並べる', text: 'カード状の項目は、PCでは2〜3列に並べ、スマホでは1列にする' }
        ] },
        { id: 'space', label: '余白', type: 'radio', term: 'whitespace', options: [
          { id: 'more', label: '余白を広げる', text: 'セクション間の余白を広げ、区切りを見つけやすくする' },
          { id: 'same', label: 'いまの余白のまま', text: '余白は今のまま維持する' }
        ] }
      ]
    },
    {
      id: 'mockup', label: 'モックアップ挿入', desc: '説明の近くに、PCやスマホの画面枠を入れます。', terms: ['mockup'],
      intro: '説明の近くに、画面のモックアップ（見本の画面枠）を入れてください。画像ファイルが無い場合は、画像を後から差し替えられる枠と、代替テキスト（alt）を用意してください。',
      groups: [
        { id: 'device', label: '画面の種類', type: 'radio', term: 'mockup', options: [
          { id: 'pc', label: 'PC画面', text: 'PC画面のモックアップ' },
          { id: 'sp', label: 'スマホ画面', text: 'スマホ画面のモックアップ' },
          { id: 'both', label: 'PCとスマホの両方', text: 'PCとスマホ両方のモックアップを並べる' }
        ] },
        { id: 'place', label: '置く場所', type: 'radio', options: [
          { id: 'top', label: 'ページの上部', text: 'ページの上部（最初に見える位置）に置く' },
          { id: 'near', label: '説明の近く', text: '関連する説明の直後に置く' }
        ] }
      ]
    },
    {
      id: 'mobile', label: 'スマホUI改善', desc: 'スマホで押しやすく、読みやすくします。', terms: ['responsive', 'navigation'],
      intro: 'スマホ（画面幅360〜390px）での使いやすさを改善してください。',
      groups: [
        { id: 'focus', label: '重点（複数選べます）', type: 'check', term: 'responsive', options: [
          { id: 'tap', label: 'ボタン・リンクを押しやすくする', text: 'ボタン・リンク・タブを、指で押しやすい大きさ（高さ44px以上）にする' },
          { id: 'font', label: '文字を読みやすくする', text: '本文を16px以上にし、補助の文字も12px未満にしない' },
          { id: 'noscroll', label: '横スクロールを出さない', text: '横スクロールが出ないようにする（長い文字列・表・コードも画面内に収める）' },
          { id: 'nav', label: 'ナビゲーションをスマホ向けにする', text: 'ナビゲーションを、スマホで押しやすく迷わない形に整える' }
        ] }
      ]
    },
    {
      id: 'faq', label: 'FAQ・アコーディオン', desc: '情報を折りたたみ式で整理します。', terms: ['accordion'],
      intro: '情報を折りたたみ式（アコーディオン）で整理してください。',
      rules: ['必須の作業手順は折りたたまず、常に表示する', 'キーボードでも開閉できるようにする'],
      groups: [
        { id: 'target', label: '折りたたむ対象', type: 'radio', term: 'accordion', options: [
          { id: 'faq', label: 'よくある質問をFAQにする', text: 'よくある質問を、質問と回答の形のFAQにする' },
          { id: 'sub', label: '補足説明を折りたたむ', text: '補足説明や長い見本を折りたたみ、必要なときだけ開けるようにする' }
        ] },
        { id: 'initial', label: '開閉の初期状態', type: 'radio', options: [
          { id: 'closed', label: 'すべて閉じておく', text: '最初はすべて閉じておく' },
          { id: 'first', label: '最初の1つだけ開く', text: '最初の1つだけ開いておく' }
        ] }
      ]
    },
    {
      id: 'steps', label: 'ステップ表示・チェックリスト', desc: '手順を、順番どおりに進めやすくします。', terms: ['steps'],
      intro: '手順を、順番どおりに進めやすい形に整えてください。',
      rules: ['必須の手順は省略しない'],
      groups: [
        { id: 'style', label: '表示の形', type: 'radio', term: 'steps', options: [
          { id: 'numbered', label: '番号付きのステップ', text: '手順に番号を付け、1ステップずつ区切って表示する' },
          { id: 'progress', label: 'ステップ＋いまの位置', text: '番号付きのステップに、現在位置が分かる表示を加える' },
          { id: 'checklist', label: 'チェックリスト', text: '確認項目をチェックリスト（チェックボックス）にする' }
        ] },
        { id: 'extra', label: '追加する要素（複数選べます）', type: 'check', options: [
          { id: 'confirm', label: '「できたら確認」欄', text: '各ステップの終わりに、できたかどうかを確かめる確認欄を付ける' },
          { id: 'next', label: '「次へ」ボタン', text: '各ステップの終わりに、次のステップへ進むボタンを付ける' }
        ] }
      ]
    }
  ]
};
