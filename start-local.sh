#!/bin/bash

echo "🎵 YouTube to MP3 Downloader - ローカル版"
echo "========================================="
echo ""

# 必要なコマンドの確認
echo "📋 環境チェック中..."

# Node.jsの確認
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません"
    echo "   インストール方法: https://nodejs.org/"
    exit 1
fi

# Pythonの確認
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3がインストールされていません"
    exit 1
fi

# ffmpegの確認
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  ffmpegがインストールされていません"
    echo "   macOS: brew install ffmpeg"
    echo "   他のOS: https://ffmpeg.org/download.html"
    echo ""
    echo "ffmpegなしで続行しますか？（音声変換は動作しません） [y/N]"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# yt-dlpの確認
if ! python3 -c "import yt_dlp" &> /dev/null 2>&1; then
    echo "📦 yt-dlpをインストール中..."
    pip install yt-dlp
fi

# mutagenの確認
if ! python3 -c "import mutagen" &> /dev/null 2>&1; then
    echo "📦 mutagenをインストール中..."
    pip install mutagen
fi

# npm依存関係の確認
if [ ! -d "node_modules" ]; then
    echo "📦 npm依存関係をインストール中..."
    npm install
fi

echo ""
echo "✅ 環境チェック完了！"
echo ""
echo "🚀 サーバーを起動中..."
echo "   URL: http://localhost:3000"
echo ""
echo "終了するには Ctrl+C を押してください"
echo ""

# サーバー起動
npm run dev