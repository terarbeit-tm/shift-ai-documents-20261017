# 資料作成実践合宿・ハンズオンガイド（制作中）

10/17の午前・スライド作成パートで使うガイドです。制作途中の版として共同編集します。

公開プレビュー：https://shift-ai-documents-20261017.pages.dev/

## 現在の内容

5タブで、インタビューによる設計メモ → スライド構成案 → 画像生成と検収 → 任意のデザイン変更を案内しています。事前準備は工務店の題材文から始め、完成例は「講義のあと」で参照できます。

操作画面10か所は差し込み枠です。参加者の画面から配布プロンプトを通す実測と、スクリーンショットの差し込みが残っています。完成版として扱うのは、その確認を終えてからです。

## 編集するファイル

- `index.html`：本文、CSS、タブとコピー操作のJavaScript。
- `images/`：サムネイル、スライドとデザイン比較の見本。
- `downloads/`：配布プロンプト、設計メモ・構成案の完成例、完成画像ZIP。

プロンプトの本文はHTML内にも入っています。修正するときは、該当する `downloads/*.txt` とHTMLのコピー欄を両方更新してください。章のIDを追加・変更した場合は、JavaScriptの `SECTION_TAB` も合わせます。

## 共同編集

このリポジトリをPCへクローンし、CodexまたはClaude Codeでフォルダーを開いて編集できます。作業を始める前に最新の変更を取り込み、重なりそうな編集箇所を先に相談します。

```bash
git clone https://github.com/terarbeit-tm/shift-ai-documents-20261017.git
cd shift-ai-documents-20261017
python3 -m http.server 8000
```

2回目以降は、作業を始める前に `git pull` で最新の変更を取り込みます。

ブラウザで `http://localhost:8000/` を開いて確認します。`main` ブランチへpushすると、Cloudflare Pagesが数分で公開プレビューを更新します。共有前には、PCとスマホ幅の表示、変更したコピー欄と直リンク、ダウンロード先を確かめてください。

公開の仕組み：GitHubの `main` ブランチとCloudflare Pagesを連携しています（[Cloudflare Pagesの公式手順](https://developers.cloudflare.com/pages/configuration/git-integration/)）。
