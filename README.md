# Slack-Obsidian Todo App

SlackとObsidianを連携したタスク管理アプリケーションです。期日管理機能と自動通知機能を搭載しています。

## 主な機能

- 📝 **タスク管理**: タイトル、説明、優先度、期日を設定できるタスク管理
- 🔔 **Slack通知**: 期限切れタスクや緊急タスクの自動Slack通知
- 📖 **Obsidian連携**: タスクに対応するObsidianノートの自動生成・同期
- ⏰ **スケジューラー**: 毎日および毎時間の自動チェック機能
- 📊 **ダッシュボード**: タスクの統計情報表示

## 技術スタック

### フロントエンド
- **Next.js 14** - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **React Query** - データフェッチング
- **React Hook Form** - フォーム管理
- **Lucide React** - アイコン

### バックエンド
- **Next.js API Routes** - サーバーサイド API
- **Prisma** - データベース ORM
- **PostgreSQL** - データベース
- **Node-cron** - スケジューラー

### 外部連携
- **Slack Web API** - Slack通知機能
- **Obsidian Vault** - ノート同期機能

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 2. 環境変数の設定

.env.local ファイルを作成し、以下の環境変数を設定してください：

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
NOTIFICATION_CRON="0 9 * * *"  # Daily at 9 AM
```

### 3. データベースの設定

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースマイグレーション
npx prisma db push

# データベーススタジオ（オプション）
npx prisma studio
```

### 4. Slack Appの設定

1. [Slack API](https://api.slack.com/apps) でアプリを作成
2. Bot Token Scopes に以下を追加：
   - `chat:write`
   - `chat:write.public`
   - `channels:read`
3. Bot User OAuth Token を `SLACK_BOT_TOKEN` に設定
4. Signing Secret を `SLACK_SIGNING_SECRET` に設定

### 5. Obsidianの設定

1. Obsidian Vault のパスを `OBSIDIAN_VAULT_PATH` に設定
2. Vault内に `todos` フォルダが自動作成されます

## 使用方法

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

### タスクの作成

1. 「新しいタスク」ボタンをクリック
2. タイトル、説明、優先度、期日を入力
3. 作成ボタンをクリック

### 通知機能

- **緊急・高優先度タスク**: 作成時に即座にSlack通知
- **期限切れタスク**: 毎日午前9時にチェック・通知
- **期限間近タスク**: 毎時間チェック（1時間以内）

### Obsidian連携

- タスク作成時に自動でObsidianノートが生成されます
- タスクの完了状態がObsidianノートにも反映されます
- TodoアイテムのObsidianリンクから直接ノートを開けます

## プロジェクト構造

```
slack-obsidian-todo/
├── app/                    # Next.js App Router
│   ├── api/               # API ルート
│   │   └── todos/        # Todo API
│   ├── globals.css       # グローバルスタイル
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # メインページ
│   └── providers.tsx     # React Query プロバイダー
├── components/            # Reactコンポーネント
│   ├── StatsCard.tsx     # 統計カード
│   ├── TodoForm.tsx      # Todo作成フォーム
│   ├── TodoItem.tsx      # Todoアイテム
│   └── TodoList.tsx      # Todoリスト
├── lib/                  # ユーティリティ
│   ├── init.ts          # アプリ初期化
│   ├── obsidian.ts      # Obsidian連携
│   ├── prisma.ts        # Prismaクライアント
│   ├── scheduler.ts     # 通知スケジューラー
│   └── slack.ts         # Slack API
├── prisma/              # Prismaスキーマ
│   └── schema.prisma    # データベーススキーマ
├── types/               # TypeScript型定義
│   └── index.ts         # 共通型定義
└── .env.example         # 環境変数サンプル
```

## API エンドポイント

- `GET /api/todos` - Todo一覧取得
- `POST /api/todos` - Todo作成
- `PATCH /api/todos/[id]` - Todo更新
- `DELETE /api/todos/[id]` - Todo削除

## デプロイ

### Vercel（推奨）

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### その他のプラットフォーム

Next.jsアプリとして標準的なデプロイが可能です。

## ライセンス

MIT License

## 貢献

プルリクエストや Issue の作成を歓迎します。

## サポート

問題が発生した場合は、GitHub Issues をご利用ください。
