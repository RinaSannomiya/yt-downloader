#!/usr/bin/env python3
import csv
import os
import sys
import requests
from urllib.parse import quote
import time
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TRCK, TIT2, TPE1, TALB
import logging
from datetime import datetime

class YouTubeToMP3Downloader:
    def __init__(self, csv_file_path):
        self.csv_file_path = csv_file_path
        self.base_url = "https://ytmp3.as/NvQ7/"
        self.setup_logging()
        
    def setup_logging(self):
        log_filename = f"download_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_filename),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def clean_filename(self, filename):
        """ファイル名に使用できない文字を除去"""
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        return filename.strip()
        
    def download_mp3(self, youtube_url, output_path):
        """YouTube URLからMP3をダウンロード"""
        try:
            # ytmp3.asサービスを使用してダウンロード
            # 注意: これは仮想的な実装です。実際のAPIドキュメントに従って実装してください
            download_url = f"{self.base_url}download?url={quote(youtube_url)}"
            
            response = requests.get(download_url, stream=True, timeout=300)
            response.raise_for_status()
            
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        
            return True
            
        except Exception as e:
            self.logger.error(f"ダウンロードエラー: {youtube_url} - {str(e)}")
            return False
            
    def set_mp3_metadata(self, file_path, track_number, title, artist=None, album=None):
        """MP3ファイルにメタデータを設定"""
        try:
            audio = MP3(file_path, ID3=ID3)
            
            # ID3タグがない場合は追加
            if audio.tags is None:
                audio.add_tags()
                
            # トラック番号を設定
            audio.tags.add(TRCK(encoding=3, text=str(track_number)))
            
            # タイトルを設定（行番号を除いたもの）
            audio.tags.add(TIT2(encoding=3, text=title))
            
            # アーティストを設定
            if artist:
                audio.tags.add(TPE1(encoding=3, text=artist))
                
            # アルバムを設定
            if album:
                audio.tags.add(TALB(encoding=3, text=album))
                
            audio.save()
            return True
            
        except Exception as e:
            self.logger.error(f"メタデータ設定エラー: {file_path} - {str(e)}")
            return False
            
    def process_csv(self):
        """CSVファイルを処理してMP3をダウンロード"""
        # CSVファイル名から出力フォルダ名を取得
        folder_name = os.path.splitext(os.path.basename(self.csv_file_path))[0]
        output_folder = self.clean_filename(folder_name)
        
        # 出力フォルダを作成
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
            
        success_count = 0
        error_count = 0
        
        try:
            with open(self.csv_file_path, 'r', encoding='utf-8') as csv_file:
                reader = csv.DictReader(csv_file)
                
                for row_num, row in enumerate(reader, start=1):
                    url = row.get('url', '').strip()
                    title = row.get('title', f'Track_{row_num}').strip()
                    artist = row.get('artist', '').strip()
                    
                    if not url:
                        self.logger.warning(f"行 {row_num}: URLが空です")
                        continue
                        
                    # ファイル名を作成（行番号_タイトル.mp3）
                    filename = f"{row_num:03d}_{self.clean_filename(title)}.mp3"
                    file_path = os.path.join(output_folder, filename)
                    
                    self.logger.info(f"ダウンロード中: {title} ({url})")
                    
                    # MP3をダウンロード
                    if self.download_mp3(url, file_path):
                        # メタデータを設定
                        if self.set_mp3_metadata(file_path, row_num, title, artist, folder_name):
                            self.logger.info(f"成功: {filename}")
                            success_count += 1
                        else:
                            self.logger.warning(f"メタデータ設定失敗: {filename}")
                    else:
                        error_count += 1
                        
                    # サーバーに負荷をかけないよう少し待機
                    time.sleep(2)
                    
        except Exception as e:
            self.logger.error(f"CSV処理エラー: {str(e)}")
            
        self.logger.info(f"\n処理完了: 成功 {success_count} 件, エラー {error_count} 件")
        self.logger.info(f"出力フォルダ: {output_folder}")
        
def main():
    if len(sys.argv) != 2:
        print("使用方法: python download_music.py <CSVファイルパス>")
        sys.exit(1)
        
    csv_file = sys.argv[1]
    if not os.path.exists(csv_file):
        print(f"エラー: CSVファイル '{csv_file}' が見つかりません")
        sys.exit(1)
        
    downloader = YouTubeToMP3Downloader(csv_file)
    downloader.process_csv()
    
if __name__ == "__main__":
    main()