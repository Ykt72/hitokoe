# Git/GitHub 反映手順

このプロジェクトをGitHubへ送るための手順です。

## 1. Gitをインストール

Windowsの場合は、Git for Windowsをインストールします。

https://git-scm.com/download/win

インストール後、PowerShellやターミナルを開き直して、以下を確認します。

```powershell
git --version
```

バージョンが表示されれば準備完了です。

## 2. プロジェクトフォルダへ移動

```powershell
cd C:\Users\yk715\Documents\Codex\2026-07-01\ko
```

## 3. Gitを初期化

```powershell
git init
git branch -M main
```

## 4. 変更を追加してコミット

```powershell
git add .
git commit -m "feat: implement hitokoe exercise timer app"
```

コミットメッセージの意味:

- `feat`: 新機能を追加したことを表します
- `implement hitokoe exercise timer app`: ひとこえの運動提案・タイマー・記録機能を実装したことを表します

## 5. GitHubリポジトリを登録

```powershell
git remote add origin https://github.com/Ykt72/hitokoe.git
```

すでに `origin` があると言われた場合は、以下を使います。

```powershell
git remote set-url origin https://github.com/Ykt72/hitokoe.git
```

## 6. GitHubへ送信

```powershell
git push -u origin main
```

GitHubへのログインを求められた場合は、画面の指示に従って認証してください。

## 以降の更新

修正後は、基本的に以下の流れで反映できます。

```powershell
git add .
git commit -m "fix: adjust hitokoe app behavior"
git push
```
