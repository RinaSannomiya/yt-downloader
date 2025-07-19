# YouTube to MP3 Downloader

CSVファイルからYouTube URLを読み込み、MP3としてダウンロードするPythonアプリケーション。

## 機能

- CSVファイルからURLと曲情報を読み込み
- MP3形式でダウンロード
- トラック番号をメタデータに埋め込み（Apple Musicで自動的に並ぶ）
- ファイル名: `行番号_曲名.mp3`
- 出力フォルダ名: CSVファイル名と同じ

## セットアップ

```bash
pip install -r requirements.txt
```

## 使用方法

```bash
python download_music.py <CSVファイルパス>
```

## CSVファイル形式

```csv
url,title,artist
https://www.youtube.com/watch?v=VIDEO_ID,曲名,アーティスト名
```

- `url`: YouTube動画のURL（必須）
- `title`: 曲名（必須）
- `artist`: アーティスト名（オプション）

## 注意事項

- 実際の使用には、ytmp3.asのAPIドキュメントに従って実装を調整する必要があります
- 著作権に注意して使用してください