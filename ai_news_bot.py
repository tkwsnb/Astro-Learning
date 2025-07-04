#!/usr/bin/env python3
"""
AI関連ニュースを毎朝Slackに投稿するボット
"""

import os
import requests
import feedparser
import json
import re
from datetime import datetime, timedelta
from typing import List, Dict
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# 環境変数の読み込み
load_dotenv()

class AINewsBot:
    def __init__(self):
        self.slack_webhook_url = os.getenv('SLACK_WEBHOOK_URL')
        self.slack_channel = os.getenv('SLACK_CHANNEL', '#ai-news')
        self.slack_bot_name = os.getenv('SLACK_BOT_NAME', 'AI News Bot')
        self.news_api_key = os.getenv('NEWS_API_KEY')
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        
        # AI関連キーワード
        self.ai_keywords = [
            'artificial intelligence', 'machine learning', 'deep learning',
            'neural network', 'AI', 'ML', 'ChatGPT', 'GPT', 'LLM',
            'large language model', 'generative AI', 'transformer',
            'computer vision', 'natural language processing', 'NLP',
            'reinforcement learning', 'AGI', 'artificial general intelligence',
            'robotics', 'automation', 'data science', 'OpenAI', 'Google AI',
            'DeepMind', 'Anthropic', 'Claude', 'Gemini', 'Copilot'
        ]
        
        # RSSフィードのURL
        self.rss_feeds = [
            'https://feeds.feedburner.com/oreilly/radar',
            'https://www.wired.com/feed/tag/ai/latest/rss',
            'https://techcrunch.com/category/artificial-intelligence/feed/',
            'https://venturebeat.com/ai/feed/',
            'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
            'https://spectrum.ieee.org/rss/blog/artificial-intelligence',
            'https://www.technologyreview.com/feed/',
        ]

    def get_rss_news(self) -> List[Dict]:
        """RSSフィードからAI関連ニュースを取得"""
        news_items = []
        yesterday = datetime.now() - timedelta(days=1)
        
        for feed_url in self.rss_feeds:
            try:
                feed = feedparser.parse(feed_url)
                for entry in feed.entries:
                    # 記事の日付をチェック（24時間以内）
                    if hasattr(entry, 'published_parsed'):
                        pub_date = datetime(*entry.published_parsed[:6])
                        if pub_date < yesterday:
                            continue
                    
                    # AI関連キーワードでフィルタリング
                    title_content = (entry.title + ' ' + entry.get('summary', '')).lower()
                    if any(keyword.lower() in title_content for keyword in self.ai_keywords):
                        news_items.append({
                            'title': entry.title,
                            'link': entry.link,
                            'summary': entry.get('summary', ''),
                            'source': feed.feed.get('title', 'RSS Feed'),
                            'published': entry.get('published', '')
                        })
                        
            except Exception as e:
                print(f"RSS取得エラー ({feed_url}): {e}")
        
        return news_items

    def get_news_api_articles(self) -> List[Dict]:
        """NewsAPIからAI関連ニュースを取得"""
        if not self.news_api_key:
            return []
        
        news_items = []
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        
        try:
            url = 'https://newsapi.org/v2/everything'
            params = {
                'q': 'artificial intelligence OR machine learning OR AI OR ChatGPT OR OpenAI',
                'from': yesterday,
                'sortBy': 'publishedAt',
                'language': 'en',
                'apiKey': self.news_api_key,
                'pageSize': 50
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            for article in data.get('articles', []):
                news_items.append({
                    'title': article['title'],
                    'link': article['url'],
                    'summary': article.get('description', ''),
                    'source': article['source']['name'],
                    'published': article['publishedAt']
                })
                
        except Exception as e:
            print(f"NewsAPI取得エラー: {e}")
        
        return news_items

    def clean_html(self, text: str) -> str:
        """HTMLタグを除去"""
        if not text:
            return ""
        soup = BeautifulSoup(text, 'html.parser')
        return soup.get_text().strip()

    def deduplicate_news(self, news_items: List[Dict]) -> List[Dict]:
        """重複ニュースを除去"""
        seen_titles = set()
        unique_items = []
        
        for item in news_items:
            # タイトルを正規化して重複チェック
            clean_title = re.sub(r'[^\w\s]', '', item['title'].lower()).strip()
            if clean_title not in seen_titles:
                seen_titles.add(clean_title)
                item['summary'] = self.clean_html(item['summary'])
                unique_items.append(item)
        
        return unique_items

    def format_slack_message(self, news_items: List[Dict]) -> str:
        """Slack用のメッセージを整形"""
        if not news_items:
            return "🤖 今日はAI関連の新しいニュースはありません。"
        
        today = datetime.now().strftime('%Y年%m月%d日')
        message = f"🚀 *AI関連ニュース* - {today}\n\n"
        
        # 重要度でソート（タイトルにキーワードが含まれるものを優先）
        priority_keywords = ['ChatGPT', 'OpenAI', 'Google', 'Microsoft', 'breakthrough', 'launches']
        news_items = sorted(news_items, key=lambda x: any(kw.lower() in x['title'].lower() for kw in priority_keywords), reverse=True)
        
        for i, item in enumerate(news_items[:10], 1):  # 最大10件
            source = item['source'][:20] + '...' if len(item['source']) > 20 else item['source']
            
            message += f"*{i}. {item['title']}*\n"
            message += f"📰 {source}\n"
            
            if item['summary']:
                summary = item['summary'][:200] + '...' if len(item['summary']) > 200 else item['summary']
                message += f"💡 {summary}\n"
            
            message += f"🔗 <{item['link']}|記事を読む>\n\n"
        
        if len(news_items) > 10:
            message += f"📊 他にも{len(news_items) - 10}件のニュースがあります。\n"
        
        return message

    def send_to_slack(self, message: str) -> bool:
        """Slackにメッセージを送信"""
        if not self.slack_webhook_url:
            print("SlackのWebhook URLが設定されていません")
            return False
        
        try:
            payload = {
                'channel': self.slack_channel,
                'username': self.slack_bot_name,
                'text': message,
                'icon_emoji': ':robot_face:'
            }
            
            response = requests.post(
                self.slack_webhook_url,
                data=json.dumps(payload),
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                print(f"✅ Slackにニュースを送信しました ({len(message)}文字)")
                return True
            else:
                print(f"❌ Slack送信エラー: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Slack送信例外: {e}")
            return False

    def run(self):
        """メイン実行処理"""
        print("🔍 AI関連ニュースを取得中...")
        
        # 各ソースからニュースを取得
        all_news = []
        all_news.extend(self.get_rss_news())
        all_news.extend(self.get_news_api_articles())
        
        # 重複除去とフィルタリング
        unique_news = self.deduplicate_news(all_news)
        print(f"📄 {len(unique_news)}件のユニークなニュースを発見")
        
        # Slackメッセージを作成・送信
        message = self.format_slack_message(unique_news)
        self.send_to_slack(message)

if __name__ == "__main__":
    bot = AINewsBot()
    bot.run()