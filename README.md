# ひとこえ

開くだけで運動を提案し、準備なしですぐ始められる運動アプリです。

ログインとGoogle連携は使用せず、ホーム画面からおすすめ運動を選び、時間を決めてすぐにタイマーを開始できます。

## 主な機能

- 今日の運動達成率の表示
- 強度別のおすすめ運動提案
- 運動時間のスライダー選択
- 円形プログレス付きタイマー
- 途中終了時の未達成記録
- 完了画面の表示
- 今週の活動サマリー
- 運動記録一覧
- 通知ON/OFFなどの設定画面

## データ保存について

記録データはブラウザの `localStorage` に保存します。
さらに、`npm run app` でサーバ付き起動をした場合は、サーバ側の `data/hitokoe-state.json` にも履歴を保存します。

同じブラウザで閉じて開き直した場合は `localStorage` から復元されます。
サーバ付き起動では、ブラウザ側の履歴とサーバ側の履歴を起動時に統合します。

ログインなしのため、サーバ保存はアプリ全体で1つの共有履歴として扱います。
ユーザーごとに分けたい場合は、今後ログインやユーザーIDの仕組みを追加する想定です。

## 起動方法

```powershell
npm install
npm run dev
```

表示されたURL（通常は http://localhost:5173）をブラウザで開きます。

## サーバ保存ありで起動

履歴をサーバ側にも残したい場合は、以下で起動します。

```powershell
npm run app
```

表示されたURL（通常は http://localhost:4173）をブラウザで開きます。

同じサーバがすでに起動している場合は、二重起動せずに既存のURLを表示して終了します。
4173番ポートを別のアプリが使っている場合は、4174番以降の空いているポートを自動で探します。

## Web公開

GitHub Pagesで公開するためのGitHub Actionsを追加しています。

GitHubにpushしたあと、リポジトリの `Settings` → `Pages` で、公開元を `GitHub Actions` に設定します。
設定後、`main` ブランチへpushすると自動でビルドされ、以下のURLで公開されます。

```text
https://ykt72.github.io/hitokoe/
```

GitHub Pages版は静的サイトとして公開されます。
サーバ保存APIは使えないため、履歴はブラウザの `localStorage` に保存されます。

検索に出やすくするため、`description`、OGP、`robots.txt`、`sitemap.xml` を追加しています。
検索結果に表示されるまでには時間がかかる場合があります。
早めに登録したい場合は、Google Search Consoleで以下のURLを登録します。

```text
https://ykt72.github.io/hitokoe/
```

## ビルド確認

```powershell
npm run build
```

## GitHubへの反映

GitHubへ送る手順は [docs/git-github-setup.md](docs/git-github-setup.md) にまとめています。

## ディレクトリ構成

```text
src/
  App.tsx                 画面遷移と全体状態の管理
  main.tsx                Reactアプリの起動
  types.ts                共通の型定義
  components/             共通UI部品
  data/                   運動データと提案ロジック
  screens/                各画面
  utils/                  保存処理や日付計算
server/
  index.js                履歴保存APIと本番表示用サーバ
```
