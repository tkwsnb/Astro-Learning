#!/bin/bash

echo "🚀 AI News Bot セットアップを開始します..."

# Python環境の確認
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3がインストールされていません"
    exit 1
fi

# 仮想環境の作成
if [ ! -d "venv" ]; then
    echo "📦 Python仮想環境を作成中..."
    python3 -m venv venv
fi

# 仮想環境の有効化
source venv/bin/activate

# 依存関係のインストール
echo "📚 依存関係をインストール中..."
pip install -r requirements.txt

# 実行権限を付与
chmod +x ai_news_bot.py

# .envファイルの存在確認
if [ ! -f ".env" ]; then
    echo "⚙️  .envファイルを作成中..."
    cp .env.example .env
    echo ""
    echo "🔧 .envファイルを編集して、Slack Webhook URLを設定してください："
    echo "   nano .env"
    echo ""
fi

# cronジョブの例を表示
echo "⏰ 毎朝8時に実行するには、以下のコマンドでcronジョブを追加してください："
echo ""
echo "crontab -e"
echo ""
echo "そして以下の行を追加："
echo "0 8 * * * cd $(pwd) && ./venv/bin/python ai_news_bot.py >> ai_news.log 2>&1"
echo ""

echo "✅ セットアップ完了！"
echo ""
echo "📋 次のステップ："
echo "1. .envファイルでSlack Webhook URLを設定"
echo "2. テスト実行: ./venv/bin/python ai_news_bot.py"
echo "3. cronジョブを設定して定期実行"