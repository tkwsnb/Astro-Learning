# 🚀 GitHubリポジトリセットアップ手順

## Step 1: GitHubでプライベートリポジトリを作成

1. [GitHub](https://github.com) にアクセス
2. 右上の「+」ボタン → 「New repository」
3. 以下の設定でリポジトリを作成：
   - **Repository name**: `slack-obsidian-todo`
   - **Description**: `SlackとObsidianを連携したタスク管理アプリ`
   - **Visibility**: 🔒 **Private** を選択
   - **Initialize with**: 何もチェックしない
4. 「Create repository」をクリック

## Step 2: ローカルからGitHubにプッシュ

### 自動セットアップ（推奨）

```bash
# 実行権限を付与
chmod +x deploy-to-github.sh

# スクリプトを実行
./deploy-to-github.sh
```

### 手動セットアップ

```bash
# 1. Gitリポジトリを初期化
git init

# 2. ファイルをステージング
git add .

# 3. 初回コミット
git commit -m "🎉 Initial commit: Slack-Obsidian Todo App"

# 4. GitHubリポジトリをリモートに追加（URLを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/slack-obsidian-todo.git

# 5. メインブランチに設定
git branch -M main

# 6. GitHubにプッシュ
git push -u origin main
```

## Step 3: 環境変数の設定

リポジトリにプッシュ後、以下を設定：

### ローカル開発用
`.env.local`ファイルを作成：

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/slack_obsidian_todo"

# Slack API
SLACK_BOT_TOKEN="xoxb-your-slack-bot-token"
SLACK_SIGNING_SECRET="your-slack-signing-secret"
SLACK_CHANNEL_ID="your-default-channel-id"

# Obsidian
OBSIDIAN_VAULT_PATH="/path/to/your/obsidian/vault"

# Notification settings
NOTIFICATION_CRON="0 9 * * *"
```

### デプロイ用（Vercel）
1. Vercelでプロジェクトをインポート
2. Environment Variables で上記の環境変数を設定
3. `DATABASE_URL`はVercel Postgres等を使用

## Step 4: 依存関係のインストールと起動

```bash
# 依存関係をインストール
npm install

# Prismaクライアント生成
npx prisma generate

# データベース初期化
npx prisma db push

# 開発サーバー起動
npm run dev
```

## 🎯 完了！

http://localhost:3000 でアプリケーションが起動します。

## 📋 その他の便利なコマンド

```bash
# データベーススタジオを開く
npx prisma studio

# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

## 🔗 リンク

- **GitHub**: https://github.com/YOUR_USERNAME/slack-obsidian-todo
- **Local**: http://localhost:3000
- **Vercel**: https://slack-obsidian-todo.vercel.app (デプロイ後)

---

💡 **Tip**: `.env.local`ファイルは既に`.gitignore`に含まれているため、GitHubにプッシュされません。