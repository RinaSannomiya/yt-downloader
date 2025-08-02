#!/usr/bin/env python3
import sys
import subprocess

def download_audio_only(youtube_url, output_path):
    """yt-dlpを使用して音声のみダウンロード（ffmpeg不要）"""
    try:
        # yt-dlpコマンドを構築（音声のみ、変換なし）
        cmd = [
            'yt-dlp',
            '-f', 'bestaudio',  # 最高品質の音声のみ
            '-o', output_path,  # 出力パス
            youtube_url
        ]
        
        # コマンドを実行
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"ダウンロード成功: {output_path}")
            return True
        else:
            print(f"yt-dlpエラー: {result.stderr}", file=sys.stderr)
            return False
            
    except Exception as e:
        print(f"ダウンロードエラー: {str(e)}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) < 3:
        print("使用方法: python download_audio_only.py <YouTube URL> <出力パス>", file=sys.stderr)
        sys.exit(1)
    
    url = sys.argv[1]
    output_path = sys.argv[2]
    
    if download_audio_only(url, output_path):
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()