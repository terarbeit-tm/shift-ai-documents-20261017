# 資料作成実践合宿・ハンズオンガイド（制作中）

10/17の午前・スライド作成パートで使うガイドです。制作途中の版として共同編集します。

公開プレビュー：https://shift-ai-documents-20261017.pages.dev/

## 現在の内容

5タブで、インタビューによる設計メモ → スライド構成案 → 画像生成と検収 → 任意のデザイン変更 → スキル化（W5）を案内しています。題材が思い浮かばない人は、事前準備の工務店の案件メモを見ながら答えます。デザイン見本カタログは当日のワークの一番下にあります。

操作画面のスクリーンショットは、2026-10-12の実測（Codexアプリ）から差し込み済みです。画像は `images/shots/` にあります。W2の操作動画と、W1の質問を選択式にした版の測り直しが残っています。

## 編集するファイル

- `index.html`：本文、CSS、タブとコピー操作のJavaScript。
- `images/`：サムネイル、スライドとデザイン比較の見本。
- `images/shots/`：操作画面のスクリーンショット（2026-10-12の実測）。
- `downloads/`：配布プロンプト（01〜05）、設計メモ・構成案の完成例、完成画像ZIP。

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
