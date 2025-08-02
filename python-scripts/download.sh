#!/bin/bash
# 簡単に実行するためのスクリプト

echo "CSVファイルをこのウィンドウにドラッグ&ドロップして、Enterを押してください："
read csv_file

# ファイルパスのクォートを削除
csv_file="${csv_file//\'/}"

# スクリプトを実行
python3 download_with_yt_dlp.py "$csv_file"