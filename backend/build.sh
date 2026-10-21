#!/usr/bin/env bash

set -o errexit  # 遇到錯誤立即停止執行

# 1. 安裝套件
pip install -r requirements.txt

# 2. 收集靜態檔案
python manage.py collectstatic --no-input

# 3. 自動套用資料庫遷移（PostgreSQL 欄位更新）
python manage.py migrate