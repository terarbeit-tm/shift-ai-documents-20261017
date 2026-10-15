/* 午後ハンズオンのプロンプト本文。確定したら、該当IDの text に文字列を入れるだけで反映される（pm.html は編集不要）。
   text が null・空 = 未設定。画面ではボタンが無効になり、開く・コピーはできない。
   例）cp1: { title: 'CP1 のプロンプト', text: `ここに全文` }
   ※ 全文は改行・記号を含めてそのままコピーされる。テンプレートリテラル内の ` と ${ は \` と \${ にする */
window.UXPromptData = Object.assign(window.UXPromptData || {}, {
  cp1: { title: 'CP1 のプロンプト', text: null },
  cp2: { title: 'CP2 のプロンプト', text: null },
  cp3: { title: 'CP3 のプロンプト', text: null },
  cp4: { title: 'CP4 のプロンプト', text: null }
});
