# 🍸 雞尾酒查詢系統後端 (Cocktail Query Backend)

本專案是一個基於 **Django 4.1.9** 與 **Django REST Framework (DRF)** 開發的雞尾酒查詢與推薦系統後端 API。本系統支援雙軌本地端開發（原生虛擬環境與 Docker 容器化），配備基於 Cosine Similarity（餘弦相似度）的機器學習雞尾酒推薦系統，並提供完整的 Render 雲端平台部署防禦機制。

---

## 🛠️ 技術棧 (Tech Stack)

- **核心框架**：Django 4.1.9 + Django REST Framework 3.14.0
- **身份驗證**：SimpleJWT (JSON Web Token)
- **資料庫支援**：PostgreSQL (本地/Docker/Render 雲端) 搭配 SQLite 保底機制
- **容器化技術**：Docker & Docker Compose
- **機器學習/資料處理**：scikit-learn (CountVectorizer), pandas, numpy, joblib
- **部署平台**：Render (Web Service + Managed PostgreSQL)
- **其他套件**：django-environ (環境變數讀取), dj-database-url (資料庫連線解析), gunicorn (生產伺服器), pillow (圖片處理)

---

## 📂 專案結構 (Project Directory Structure)

```text
cocktail_query_backend/
├── api/                       # API 應用程式目錄
│   ├── fixtures/              # 資料庫初始資料 (包含 cocktail_data.json)
│   ├── migrations/            # 資料庫遷移檔
│   ├── models.py              # 資料庫模型 (Base, Liqueur, Alcohol, Ingredient, Cocktail)
│   ├── serializers.py         # DRF 序列化器
│   ├── tests.py               # API 端點單元測試
│   ├── urls.py                # API 路由規則
│   ├── utils.py               # 推薦系統模型訓練工具 (build_model)
│   └── views.py               # API 視圖邏輯 (CRUD, 推薦, 備份, 圖表)
├── backupData/                # 資料庫備份檔存放目錄
├── cocktailData/              # 機器學習模型與特徵 CSV 存放目錄
├── cocktail_query_drf/        # 專案核心設定目錄
│   ├── .env                   # 本地開發環境變數 (手動建立，請勿提交至 Git)
│   ├── settings.py            # Django 全域設定
│   ├── urls.py                # 主路由設定
│   └── wsgi.py / asgi.py      # 伺服器網關介面
├── .env.example               # 環境變數範本
├── Dockerfile                 # Docker 映像檔建置規則
├── docker-compose.yml         # Docker 容器編排設定
├── build.sh                   # Render 雲端自動建置腳本
├── manage.py                  # Django 命令行管理工具
├── requirements.txt           # Python 套件依賴清單
```

---

## 🧭 核心同步設計藍圖 (Dual-Track Development)

為了確保本地端**實體電腦環境 (原生 venv)** 與 **Docker 容器環境** 100% 鏡像同步，本專案將兩者的資料庫名稱、帳號與密碼完全對齊：
- **資料庫名稱**：`cocktail_db`
- **資料庫帳號**：`cocktail_user`
- **資料庫密碼**：`cocktail_password`

### ⚠️ 核心心法：Port 5432 爭奪戰
兩套模式在連向本機時都會佔用 **`5432` 連接埠**，**同一時間只能擇一啟動**：
- **想用原生環境** ➔ 必須**啟動** Windows 實體 PostgreSQL 服務。
- **想用 Docker 環境** ➔ 必須**停止** Windows 實體 PostgreSQL 服務，釋放 `5432` 連接埠給 Docker。

---

## 🚀 本地開發指南

> 💡 本地環境與 Docker 快速啟動完整步驟，請直接參閱 **[專案根目錄 Quick Start](../README.md#2-啟動後端-backend)**。本篇著重說明本地資料庫配置與常用維護指令。

### 🟢 模式一：原生實體環境配置
*適合時機：進行秒級反應的輕量修改、希望節省電腦耗電與記憶體時。*

#### 1. 本地 PostgreSQL 資料庫設定
1. 按下 `Win + R` 輸入 `services.msc`，確保本機 **`postgresql-x64-16`**（或對應版本）處於 **啟動 (Start)** 狀態。
2. 開啟 **pgAdmin 4** 以 `postgres` 管理員登入：
   - 建立 Login Role: `cocktail_user`，密碼設為 `cocktail_password`。
   - **關鍵授權 (CREATEDB)**：點擊 `cocktail_user` 右鍵 Properties ➔ Privileges ➔ 將 **`Can create database?`** (或 `CREATEDB`) 勾選為 **YES** *(此權限使 Django `test` 自動化測試能順利建立暫時資料庫)*。
   - 建立 Database: `cocktail_db`，擁有者 (Owner) 務必選為 **`cocktail_user`**。

#### 2. 環境變數設定 (`cocktail_query_drf/.env`)
```ini
DJANGO_SECRET_KEY=your-local-dev-secret-key
DEBUG=True
DEVELOPMENT_MODE=True
DATABASE_URL= # 👈 本地原生環境務必保持空白，由下方個別變數驅動

PostgreSQL_NAME=cocktail_db
PostgreSQL_USER=cocktail_user
PostgreSQL_PASSWORD=cocktail_password
PostgreSQL_HOST=127.0.0.1
PostgreSQL_PORT=5432
```

#### 3. 常用開發指令
```powershell
# 執行自動化測試
python manage.py test

# 重新訓練/更新機器學習模型
python manage.py shell -c "from api.utils import build_model; build_model()"
```

---

### 🔵 模式二：Docker 容器環境日常維護
*適合時機：主力功能開發、新增第三方套件、準備推上 Render 線上環境前的最終 100% 複製測試。*

#### 1. 釋放 5432 連接埠
進入 Windows 服務（`services.msc`），找到 **`postgresql-x64-16`**（或本機對應的 PostgreSQL），按右鍵點擊 **停止 (Stop)**。

#### 2. Docker 常用維護指令
在 `backend` 目錄下執行：

- **日常開機（背景執行）**：
  ```bash
  docker compose up -d
  ```
- **更新 `requirements.txt` 或修改 `Dockerfile` 時（重新構建）**：
  ```bash
  docker compose up -d --build
  ```
- **日常維護與測試指令**：
  ```bash
  docker compose exec web python manage.py test                         # 於容器內執行單元測試
  docker compose exec web python manage.py migrate                      # 變更欄位結構時執行
  docker compose exec web python manage.py loaddata api/fixtures/cocktail_data.json  # 匯入初始酒譜資料
  docker compose exec web python manage.py createsuperuser              # 建立容器內超級管理員
  ```
- **下班關機（釋放 Port，資料仍儲存於 volume 不會遺失）**：
  ```bash
  docker compose down
  ```

---

## 🤖 推薦系統機器學習模型

本專案利用**自然語言處理 (NLP)** 技術實作酒譜推薦：
1. **特徵建置 (Feature Building)**：
   - 呼叫 [api/utils.py](api/utils.py) 中的 `build_model` 函數。
   - 該工具會讀取資料庫中所有 Cocktail 的基酒、利口酒、其他酒類、副材料名稱，整合成特徵字串並匯出為 CSV。
2. **相似度計算 (Cosine Similarity)**：
   - 利用 `CountVectorizer` 將酒譜原料轉換為詞頻向量，並計算雞尾酒之間的餘弦相似度。
   - 相似度矩陣以 `joblib` 序列化並儲存於 `cocktailData/cocktailModel.joblib`。
3. **API 推薦服務**：
   - 請求 `/api/cocktail-recommendation/<pk>/` 時，系統載入 `joblib` 模型，比對輸入酒款與其他酒款的相似係數，取出相似度最高的前 9 款調酒（排除自身），序列化後回傳。

---

## 💾 資料備份機制

為避免手動維護測試資料的繁瑣，API 提供了一鍵式備份端點：
- **端點路由**：`/api/backup-data/`
- **運作原理**：
  - 視圖 [backupData](api/views.py) 會自動查詢資料庫中所有的基酒、利口酒、其他酒類、副材料以及雞尾酒資料。
  - 將其序列化為 Django 標準 fixture 的格式，並在專案根目錄的 `backupData/cocktail_data.json` 寫入。
  - 最後將該 JSON 檔作為附件回傳給請求者進行下載。
- **恢復方式**：可使用 `python manage.py loaddata backupData/cocktail_data.json` 進行資料恢復。

---

## ☁️ 🚀 部署至 Render 雲端平台指南

本專案採用 `dj_database_url` 實作多棲資料庫設定，在 Render 部署時可選擇 **原生 Python 部署** 或 **Docker 部署**。

### 🗄️ Step 1：建立 Render PostgreSQL 託管資料庫
1. 登入 Render Dashboard，點擊 **New +** ➔ 選擇 **PostgreSQL**。
2. 配置資訊：
   - **Name**: `cocktail-prod-db`
   - **Database**: `cocktail_db`
   - **User**: `cocktail_user`
   - **Region**: 建議選 `Singapore` 或與您 Web Service 相同的區域。
3. 建立後，在控制面板中取得：
   - **Internal Database URL**（內部直連，用於同一 Region 的 Web Service 連線）
   - **External Database URL**（外部連線，用於本地端遠端維護）

### 📦 Step 2：選擇 Web Service 部署方案

#### 💡 方案 A：使用「原生 Python 環境」部署 (輕量快速)
1. **確認自動建置腳本 `build.sh`**：
   該腳本會自動安裝依賴、收集靜態檔案並進行資料庫遷移：
   ```bash
   #!/usr/bin/env bash
   set -o errexit
   pip install -r requirements.txt
   python manage.py collectstatic --no-input
   python manage.py migrate
   ```
2. **在 Render 建立 Web Service**：
   - **Language**: `Python`
   - **Root Directory**: `backend`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn cocktail_query_drf.wsgi:application`
3. **🚨 配置環境變數 (Environment Variables)**：
   - **`PYTHON_VERSION`** ➔ **`3.12.5`** *(極重要！對齊本地 Python 版本，確保 numpy, pandas 預編譯套件在 Linux 上能成功安裝)*
   - `DJANGO_SECRET_KEY` ➔ 生產環境專用密鑰字串
   - `DEBUG` ➔ `False`
   - `ALLOWED_HOSTS` ➔ `127.0.0.1,localhost,your-backend-app.onrender.com` *(排除 Django 400 Bad Request 錯誤)*
   - `DATABASE_URL` ➔ 填入 Render 提供之 **Internal Database URL**

#### 🐳 方案 B：使用「Docker 容器環境」部署 (推薦：環境 100% 鏡像對齊)
1. **Render Web Service 設定**：
   - **Language / Environment**: `Docker`
   - **Root Directory**: `backend` *(儲存庫為前後端共用，務必指定後端根目錄)*
   - **Name**: 自訂服務名稱（如 `cocktail-query`，此名稱會直接決定配發的預設子網域 `https://your-backend-app.onrender.com`。若事後需更改子網域，需刪除該 Service 後重新建立）
2. **配置環境變數 (Environment Variables)**：
   - `DJANGO_SECRET_KEY` ➔ 生產環境專用密鑰字串
   - `DEBUG` ➔ `False`
   - `ALLOWED_HOSTS` ➔ `127.0.0.1,localhost,your-backend-app.onrender.com` *(務必加入 Render 子網域，否則存取時 Django 會拋出 400 Bad Request)*
   - `DATABASE_URL` ➔ 填入 Render 提供之 **Internal Database URL**
3. **靜態檔案與樣式託管機制 (WhiteNoise)**：
   - 在生產環境（`DEBUG=False`）下，Django 預設不處理靜態資源，會造成 Django REST framework (DRF) 與 Admin 後台樣式跑版遺失（缺少 CSS/JS）。
   - 本專案已整合 **WhiteNoise** 模組，並在 `Dockerfile` 建置階段自動執行 `python manage.py collectstatic --no-input`，由 Gunicorn/WSGI 原生高速提供壓縮與快取的靜態檔案服務。

---

### 🛑 Step 3：免費方案之「重複匯入防禦」
由於專案初始 fixture `api/fixtures/cocktail_data.json` 中的資料**沒有指定 `"pk"` 或 `"id"`**，若直接在 Render 每次部署建置的 `build.sh` 中執行 `loaddata`，由於免費方案的休眠唤醒機制，會導致資料在資料庫中**成倍重複寫入**。

**解決對策**：**嚴禁**將 `loaddata` 指令寫在 `build.sh` 或 Docker 啟動指令中。一律採用下方的 **Step 4 SOP** 進行一次性、安全的手動初始化。

---

### 🛠️ Step 4：免費方案專用——遠端直連安全資料初始化 SOP

本方案利用本地實體電腦作為跳板，透過 Render 的外部管道（傳送門）直連雲端 PostgreSQL，進行安全且乾淨的單次初始化。

1. **獲取外部連線字串**：
   到 Render 後台的 PostgreSQL 頁面，複製 **External Database URL**。
2. **暫時開通本地傳送門**：
   打開本地電腦內層 [cocktail_query_drf/.env](cocktail_query_drf/.env)，將該 URL 貼至 `DATABASE_URL` 欄位：
   ```ini
   # 👈 暫時貼上 Render External Database URL
   DATABASE_URL=postgres://cocktail_user:password@xxxx.singapore-postgres.render.com/cocktail_db
   ```
3. **執行一次性初始化指令**：
   確保本地虛擬環境已啟用，在最外層目錄執行：
   ```powershell
   # 建立雲端超級管理員 (請在提示下設定帳密)
   python manage.py createsuperuser

   # 匯入初始酒譜測試資料
   python manage.py loaddata api/fixtures/cocktail_data.json
   ```
4. **收尾與安全關閉 (⚠️ 極重要)**：
   操作完成後，請**立刻**回到本地 [.env](cocktail_query_drf/.env) 檔案中，將 `DATABASE_URL` 後方的字串**全部清空、恢復留白**：
   ```ini
   # 👈 務必恢復留白！防止本地開發變更污染雲端資料庫
   DATABASE_URL=
   ```

---

### 🌐 Step 5：上線驗證
部署與初始化完成後，可透過 Render 提供的網址進行測試：
- **驗證 API 總覽**：`https://[你的專案名稱].onrender.com/api/`
- **驗證前端 API**：`https://[你的專案名稱].onrender.com/api/cocktail-list/`
- **後台登入**：`https://[你的專案名稱].onrender.com/admin/` (使用 Step 4 建立的雲端帳密)
