# AI News Bot for Slack 🤖

毎朝AI関連のニュースを自動的にSlackに投稿するボットです。

## 🚀 特徴

- **複数のソース**: RSS フィードと News API から AI 関連ニュースを収集
- **自動フィルタリング**: AI、機械学習、ChatGPT などのキーワードで自動フィルタリング
- **重複除去**: 重複したニュースを自動的に除去
- **美しいフォーマット**: Slack で読みやすい形式で投稿
- **定期実行**: cron ジョブで毎朝自動実行

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
chmod +x setup.sh
./setup.sh
```

### 2. Slack Webhook URL の設定

1. [Slack Apps](https://api.slack.com/apps) でアプリを作成
2. Incoming Webhooks を有効化
3. Webhook URL をコピー
4. `.env` ファイルを編集:

```bash
nano .env
```

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_CHANNEL=#ai-news
SLACK_BOT_NAME=AI News Bot
```

### 3. テスト実行

```bash
./venv/bin/python ai_news_bot.py
```

### 4. 定期実行の設定

毎朝 8:00 に実行するには：

```bash
crontab -e
```

以下の行を追加：

```
0 8 * * * cd /path/to/your/project && ./venv/bin/python ai_news_bot.py >> ai_news.log 2>&1
```

## ⚙️ オプション設定

### News API (追加のニュースソース)

1. [News API](https://newsapi.org/) でアカウント作成
2. API キーを `.env` に追加:

```env
NEWS_API_KEY=your_news_api_key_here
```

### OpenAI API (ニュース要約機能)

1. [OpenAI](https://openai.com/api/) でアカウント作成
2. API キーを `.env` に追加:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 📊 ニュースソース

- **RSS フィード**:
  - O'Reilly Radar
  - Wired AI
  - TechCrunch AI
  - VentureBeat AI
  - The Verge AI
  - IEEE Spectrum AI
  - MIT Technology Review
  
- **News API** (オプション): 50以上の国際的なニュースソース

## 🔧 カスタマイズ

`ai_news_bot.py` を編集して以下をカスタマイズできます：

- **キーワード**: `self.ai_keywords` リストでフィルタリング対象を変更
- **RSS フィード**: `self.rss_feeds` リストでニュースソースを追加/削除
- **投稿時間**: cron ジョブの時間設定を変更
- **投稿件数**: `news_items[:10]` の数値を変更

---

# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
