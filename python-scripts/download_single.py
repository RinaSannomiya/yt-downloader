#!/usr/bin/env python3
import sys
import subprocess
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TRCK, TIT2, TPE1, TALB

def download_mp3_yt_dlp(youtube_url, output_path):
    """yt-dlpを使用してYouTube URLからMP3をダウンロード"""
    try:
        # yt-dlpコマンドを構築
        cmd = [
            'yt-dlp',
            '-x',  # 音声のみ抽出
            '--audio-format', 'mp3',  # MP3形式
            '--audio-quality', '0',  # 最高品質
            '-o', output_path,  # 出力パス
            '--prefer-ffmpeg',  # ffmpegを優先的に使用
            youtube_url
        ]
        
        # ffmpegの場所を探す（一般的な場所）
        ffmpeg_locations = [
            '/usr/local/bin/ffmpeg',
            '/opt/homebrew/bin/ffmpeg',
            '/usr/bin/ffmpeg'
        ]
        
        for location in ffmpeg_locations:
            import os
            if os.path.exists(location):
                cmd.insert(1, '--ffmpeg-location')
                cmd.insert(2, os.path.dirname(location))
                break
        
        # コマンドを実行
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            return True
        else:
            print(f"yt-dlpエラー: {result.stderr}", file=sys.stderr)
            return False
            
    except Exception as e:
        print(f"ダウンロードエラー: {str(e)}", file=sys.stderr)
        return False

def set_mp3_metadata(file_path, track_number, title, artist=None, album=None):
    """MP3ファイルにメタデータを設定"""
    try:
        audio = MP3(file_path, ID3=ID3)
        
        # ID3タグがない場合は追加
        if audio.tags is None:
            audio.add_tags()
            
        # トラック番号を設定
        audio.tags.add(TRCK(encoding=3, text=str(track_number)))
        
        # タイトルを設定
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
        print(f"メタデータ設定エラー: {str(e)}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) < 4:
        print("引数が不足しています", file=sys.stderr)
        sys.exit(1)
    
    url = sys.argv[1]
    output_path = sys.argv[2]
    track_number = int(sys.argv[3])
    title = sys.argv[4]
    artist = sys.argv[5] if len(sys.argv) > 5 else None
    album = sys.argv[6] if len(sys.argv) > 6 else None
    
    # MP3をダウンロード
    if not download_mp3_yt_dlp(url, output_path):
        sys.exit(1)
    
    # メタデータを設定
    if not set_mp3_metadata(output_path, track_number, title, artist, album):
        # メタデータ設定に失敗してもファイルは作成されているので警告のみ
        print("警告: メタデータの設定に失敗しました", file=sys.stderr)
    
    print(f"成功: {output_path}")
    sys.exit(0)

if __name__ == "__main__":
    main()