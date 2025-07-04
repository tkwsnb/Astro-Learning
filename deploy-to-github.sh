#!/bin/bash

# GitHubリポジトリへのデプロイスクリプト
echo "🚀 GitHubリポジトリにデプロイ中..."

# Gitリポジトリの初期化
git init

# .gitignoreファイルを作成
cat > .gitignore << EOL
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
.next/
out/
dist/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
*.log

# Database
*.db
*.sqlite

# Prisma
prisma/migrations/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOL

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "🎉 Initial commit: Slack-Obsidian Todo App

✨ Features:
- Task management with due dates and priorities
- Slack notifications for overdue and urgent tasks
- Obsidian integration for automatic note creation
- Real-time dashboard with statistics
- Automated scheduling and notifications

🔧 Tech Stack:
- Next.js 14 + TypeScript
- Prisma + PostgreSQL
- Slack Web API
- Obsidian Vault integration
- TailwindCSS + React Query"

echo "✅ ローカルリポジトリが初期化されました"
echo ""
echo "📋 次の手順:"
echo "1. GitHubでプライベートリポジトリを作成してください"
echo "2. 作成したリポジトリのURLを確認してください"
echo "3. 以下のコマンドを実行してください:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎯 YOUR_USERNAME と YOUR_REPO_NAME を実際の値に置き換えてください"