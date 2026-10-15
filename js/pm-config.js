/* 午後ハンズオンの設定。初期HTMLのダウンロードURLが確定したら、url に https:// のURLを入れるだけで反映される。
   url が空・https以外 = 準備中（ボタンは無効）。
   fileName は画面に表示する名前（ダウンロード後のファイル名の案内用）。
   complete.xUrl：「合宿完走！」モーダルの「Xでアウトプットする」の遷移先。投稿画面のURLを、加工せずそのまま使う（https のみ）。
   空 = 未設定（ボタンは無効）。 */
window.PM_CONFIG = {
  startHtml: {
    url: '',
    fileName: ''
  },
  complete: {
    xUrl: 'https://twitter.com/intent/tweet?text=%0A%0Ahttps%3A%2F%2Fx.com%2FSHIFT_AI_0%2Fstatus%2F2104149135423164582%3Fs%3D20&openExternalBrowser=1'
  }
};
