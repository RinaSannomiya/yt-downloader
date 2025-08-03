# Node.jsとPythonの両方を含むベースイメージ
FROM nikolaik/python-nodejs:python3.11-nodejs18

# 作業ディレクトリを設定
WORKDIR /app

# ffmpegをインストール
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# Node.js依存関係をインストール
RUN npm install

# Pythonの依存関係ファイルをコピー
COPY python-scripts/requirements.txt ./python-scripts/

# Python依存関係をインストール
RUN pip install --no-cache-dir -r python-scripts/requirements.txt

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsアプリをビルド
RUN npm run build

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "start"]