/* 午後ハンズオンの設定。初期HTMLのダウンロードURLが確定したら、url に https:// のURLを入れるだけで反映される。
   url が空・https以外 = 準備中（ボタンは無効）。
   fileName は画面に表示する名前（ダウンロード後のファイル名の案内用）。
   complete.shareUrl：「合宿完走！」モーダルの「Xでアウトプットする」で、投稿文に入れる10月合宿用のURL（https）。
   空 = 未設定（ボタンは無効）。確定するまで、9月用のURLなどを入れない。 */
window.PM_CONFIG = {
  startHtml: {
    url: '',
    fileName: ''
  },
  complete: {
    shareUrl: ''
  }
};
