#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
manual-index.js 生成ツール（ローカル file:/// 絶対リンク版）
指定フォルダ以下の .html/.htm ファイルをスキャンし、
window.manualData = […]; 形式で manual-index.js を出力します。
"""

import os
import json
import tkinter as tk
from tkinter import filedialog, messagebox

def extract_title_from_html(file_path):
    """
    HTML の <title> タグを抜き出して返す。
    見つからない／エラー時は None を返す。
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                low = line.lower()
                if "<title>" in low and "</title>" in low:
                    start = low.find("<title>") + len("<title>")
                    end   = low.find("</title>")
                    return line[start:end].strip()
    except Exception as e:
        print(f"エラー（{file_path}）: {e}")
    return None

def generate_manual_index_js(directory):
    """
    指定ディレクトリ配下を再帰的に走査し、
    各 HTML/HTM ファイルのタイトルと file:/// 絶対 URL を集めた
    window.manualData 配列を manual-index.js として出力する。
    """
    index_data = []

    # 絶対パス → file:/// URI のベースを作成
    base_dir_abs = os.path.abspath(directory)
    # Windows の \ を / に置換して file:/// を付与
    base_url = 'file:///' + base_dir_abs.replace('\\', '/') + '/'

    # 再帰的に scan
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.lower().endswith(('.html', '.htm')):
                full_path = os.path.join(root, filename)
                # ディレクトリ基準の相対パスを生成
                rel_path = os.path.relpath(full_path, start=directory).replace('\\', '/')
                # file:///～付きの絶対リンク
                abs_url  = base_url + rel_path
                title    = extract_title_from_html(full_path)
                if title:
                    index_data.append({
                        "title": title,
                        "url":   abs_url
                    })

    if not index_data:
        messagebox.showwarning("警告", "HTMLファイルからタイトルを取得できませんでした。")
        return

    # JS コンテンツ生成
    js_content = (
        "window.manualData = " +
        json.dumps(index_data, ensure_ascii=False, indent=2) +
        ";"
    )

    # 出力ファイルパス
    out_path = os.path.join(directory, 'manual-index.js')
    try:
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        messagebox.showinfo("完了", f"manual-index.js を生成しました:\n{out_path}")
    except Exception as e:
        messagebox.showerror("エラー", f"ファイル出力に失敗しました:\n{e}")

def select_directory_and_generate():
    """
    フォルダ選択ダイアログを開いて、
    生成処理を呼び出すラッパー関数。
    """
    directory = filedialog.askdirectory(
        title="HTMLファイルのあるルートフォルダを選択"
    )
    if directory:
        generate_manual_index_js(directory)

if __name__ == "__main__":
    root = tk.Tk()
    root.title("manual-index.js 生成ツール")
    root.geometry("400x180")

    label = tk.Label(
        root,
        text=(
            "ルートフォルダ以下すべての .html/.htm ファイルから\n"
            "manual-index.js を生成します（file:/// 絶対リンク）"
        ),
        pady=20,
        justify='center'
    )
    label.pack()

    button = tk.Button(
        root,
        text="フォルダを選択して生成",
        command=select_directory_and_generate,
        height=2,
        width=30
    )
    button.pack()

    root.mainloop()
