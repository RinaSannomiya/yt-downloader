# デプロイオプション

## 1. ローカル実行版（推奨）
```bash
cd python-scripts
pip install -r requirements.txt
python download_with_yt_dlp.py sample_music.csv
```
✅ 完全に動作
✅ 制限なし
❌ 自分のPCでのみ使用可能

## 2. セルフホスト版（VPS）
- DigitalOcean、AWS EC2などのVPSを借りる
- Node.jsとyt-dlpをインストール
- Next.jsアプリを修正して実際にyt-dlpを実行

✅ ブラウザからアクセス可能
✅ 完全な機能
❌ 月額費用がかかる（$5〜）

## 3. 外部API利用版
```javascript
// app/api/convert/route.ts を修正
const response = await fetch('https://api.ytmp3.cc/convert', {
  method: 'POST',
  body: JSON.stringify({ url: videoUrl })
})
```
✅ Vercelで動作
❌ 外部サービスに依存
❌ API制限あり

## 4. Dockerコンテナ版
```dockerfile
FROM node:18
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg
RUN pip3 install yt-dlp
COPY . .
RUN npm install
CMD ["npm", "start"]
```
✅ どこでもデプロイ可能
✅ 完全な機能
❌ コンテナホスティングが必要