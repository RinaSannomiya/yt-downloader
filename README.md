# YouTube to MP3 Downloader (ローカル版)

CSVファイルからYouTube動画をMP3として一括ダウンロードするWebアプリケーション。

⚠️ **このアプリケーションはローカル環境専用です**

## 機能

- CSVファイルのアップロード（複数形式対応）
- 複数動画の一括処理
- トラック番号の自動付与
- リアルタイムプログレス表示
- 一括ダウンロード
- メタデータ（ID3タグ）の自動設定

## 必要な環境

- macOS / Linux / Windows
- Node.js 18以上
- Python 3.8以上
- ffmpeg
- yt-dlp

## セットアップ

### 1. 必要なツールのインストール

#### macOS (Homebrewを使用)
```bash
# Homebrewのインストール（未インストールの場合）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# ffmpegのインストール
brew install ffmpeg

# yt-dlpのインストール
pip install yt-dlp

# mutagenのインストール（メタデータ編集用）
pip install mutagen
```

#### その他のOS
- ffmpeg: https://ffmpeg.org/download.html
- yt-dlp: `pip install yt-dlp`

### 2. プロジェクトのセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/RinaSannomiya/yt-downloader.git
cd yt-downloader

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 3. アプリケーションへのアクセス

ブラウザで `http://localhost:3000` を開く

## 使い方

1. CSVファイルを準備
2. Webアプリでファイルをアップロード
3. 「変換開始」をクリック
4. 処理完了後、MP3ファイルをダウンロード

## 対応CSVファイル形式

### 形式1: 標準形式
```csv
url,title,artist
https://www.youtube.com/watch?v=VIDEO_ID,曲名,アーティスト名
```

### 形式2: 日本語ヘッダー形式
```csv
曲名,URL
旅愁,https://www.youtube.com/watch?v=1qZUhjXoq4Q
```

## トラブルシューティング

### ffmpegが見つからないエラー
```
ERROR: Postprocessing: ffprobe and ffmpeg not found
```
→ ffmpegがインストールされていません。上記の手順でインストールしてください。

### yt-dlpエラー
```
yt-dlpエラー: ERROR: ...
```
→ yt-dlpを最新版にアップデート: `pip install -U yt-dlp`

## 注意事項

- このツールは個人利用を目的としています
- ダウンロードする動画の著作権を確認してください
- YouTubeの利用規約を遵守してください
- Vercelなどのクラウドサービスでは動作しません（ローカル専用）

## 開発者向け情報

### プロジェクト構成
```
yt-downloader/
├── app/                    # Next.js アプリケーション
│   ├── api/               # APIルート
│   │   ├── convert/       # 変換API
│   │   └── download/      # ダウンロードAPI
│   └── page.tsx           # メインページ
├── python-scripts/        # Pythonスクリプト
│   └── download_single.py # yt-dlp実行スクリプト
└── temp/                  # 一時ファイル（自動生成）
```

### APIエンドポイント
- `POST /api/convert` - YouTube動画をMP3に変換
- `GET /api/download` - 変換済みファイルのダウンロード
- `POST /api/cleanup` - 古い一時ファイルの削除