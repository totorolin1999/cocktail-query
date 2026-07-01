# 使用官方輕量版 Python 映像檔
FROM python:3.12.5-slim

# 設定環境變數
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# 設定容器內的工作目錄
WORKDIR /app

# 安裝編譯所需的系統套件 (因為 requirements 有 numpy, scipy, pandas, pillow 等)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 複製並安裝 Python 套件
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 複製專案所有程式碼到容器中
COPY . /app/

# 開放連接埠
EXPOSE 8000

# 啟動命令 (使用你的專案名稱 cocktail_query_drf)
CMD ["gunicorn", "cocktail_query_drf.wsgi:application", "--bind", "0.0.0.0:8000"]