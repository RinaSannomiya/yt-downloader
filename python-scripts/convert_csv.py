#!/usr/bin/env python3
import csv
import sys

def convert_csv(input_file, output_file):
    """NumbersからエクスポートしたCSVを必要な形式に変換"""
    with open(input_file, 'r', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        
        with open(output_file, 'w', encoding='utf-8', newline='') as outfile:
            writer = csv.writer(outfile)
            
            # ヘッダーを書き込み
            writer.writerow(['url', 'title', 'artist'])
            
            # 最初の行（元のヘッダー）をスキップ
            next(reader)
            
            # データを変換
            for row in reader:
                if len(row) >= 2 and row[1].strip():  # URLが存在する場合
                    title = row[0].strip()
                    url = row[1].strip()
                    writer.writerow([url, title, ''])
                    
    print(f"変換完了: {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("使用方法: python3 convert_csv.py 入力.csv 出力.csv")
        sys.exit(1)
        
    convert_csv(sys.argv[1], sys.argv[2])