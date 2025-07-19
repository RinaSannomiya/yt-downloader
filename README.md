# YouTube to MP3 Downloader (Web Version)

CSVファイルからYouTube動画をMP3として一括ダウンロードするWebアプリケーション。

## 機能

- CSVファイルのアップロード
- 複数動画の一括処理
- トラック番号の自動付与
- プログレス表示
- 一括ダウンロード

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## デプロイ

### Vercelへのデプロイ

1. GitHubにリポジトリをプッシュ
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Vercelでプロジェクトをインポート
- https://vercel.com にアクセス
- "New Project"をクリック
- GitHubリポジトリを選択
- デプロイ

## 注意事項

現在の実装はモックです。実際のYouTube動画変換機能を実装する場合は：

1. サーバーサイドでyt-dlpやffmpegを使用
2. 外部のAPIサービスを利用
3. 著作権とライセンスに注意

## CSVファイル形式

```csv
url,title,artist
https://www.youtube.com/watch?v=VIDEO_ID,曲名,アーティスト名
```