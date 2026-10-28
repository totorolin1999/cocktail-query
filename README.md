# 🍸 Cocktail Query — 雞尾酒查詢與智慧推薦系統

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.1.9-092E20.svg?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 一個現代化、前後端分離架構的雞尾酒查詢、數據可視化與智慧推薦平台。採用 **React** 搭配 **Django REST Framework**，並結合 **自然語言處理 (NLP) 餘弦相似度演算法**，為喜愛調酒的使用者提供精準的酒譜推薦與原料洞察。本專案支援雙軌本地端開發（原生虛擬環境與 Docker 容器化），配備三層資料庫自動回退策略，並具備完整的 Render 雲端平台部署防禦機制。

---

## 📑 目錄 (Table of Contents)

- [🌟 主要功能亮點 (Key Features)](#-主要功能亮點-key-features)
- [🛠️ 系統技術棧 (Tech Stack)](#️-系統技術棧-tech-stack)
- [📂 完整專案目錄結構 (Project Directory Structure)](#-完整專案目錄結構-project-directory-structure)
- [⚡ 快速開始 (Quick Start)](#-快速開始-quick-start)
  - [1. 複製專案庫](#1-複製專案庫)
  - [2. 啟動後端 (Backend)](#2-啟動後端-backend)
  - [3. 啟動前端 (Frontend)](#3-啟動前端-frontend)
- [🧭 核心資料庫連線機制與 DATABASE_URL](#-核心資料庫連線機制與-database_url)
  - [三層資料庫自動回退策略與運作模式](#三層資料庫自動回退策略與運作模式)
  - [🚨 使用 SQLite 時的資料特性與消失風險](#-使用-sqlite-時的資料特性與消失風險)
  - [實體與 Docker 雙軌同步設定](#實體與-docker-雙軌同步設定)
- [💻 本地開發與維護指南 (Development & Maintenance)](#-本地開發與維護指南-development--maintenance)
  - [🟢 後端模式一：原生實體環境配置](#-後端模式一原生實體環境配置)
  - [🔵 後端模式二：Docker 容器環境日常維護](#-後端模式二docker-容器環境日常維護)
  - [🧪 前端測試專案 (Frontend Testing)](#-前端測試專案-frontend-testing)
  - [📦 前端專案打包 (Frontend Build)](#-前端專案打包-frontend-build)
- [🤖 推薦系統機器學習模型 (Recommendation Engine)](#-推薦系統機器學習模型-recommendation-engine)
- [💾 資料備份與恢復機制 (Data Backup & Restore)](#-資料備份與恢復機制-data-backup--restore)
- [☁️ 部署至 Render 雲端平台完整指南 (Render Cloud Deployment)](#️-部署至-render-雲端平台完整指南-render-cloud-deployment)
  - [Step 1：建立 Render PostgreSQL 託管資料庫](#step-1建立-render-postgresql-託管資料庫)
  - [Step 2：選擇 Web Service 部署方案](#step-2選擇-web-service-部署方案)
  - [Step 3：資料庫自動遷移與初始資料載入 (已自動化)](#step-3資料庫自動遷移與初始資料載入-已自動化)
  - [Step 4：建立雲端超級管理員 (Superuser)](#step-4建立雲端超級管理員-superuser)
  - [Step 5：上線驗證](#step-5上線驗證)
- [📄 授權條款 (License)](#-授權條款-license)

---

## 🌟 主要功能亮點 (Key Features)

- 🔍 **多維度智能檢索**：支援依調酒名稱、六大基酒、利口酒、其他酒類及副材料進行即時交叉篩選。
- 🤖 **NLP 調酒推薦引擎**：運用 `scikit-learn` 將酒譜成份轉化為詞頻特徵向量，透過餘弦相似度（Cosine Similarity）推薦風格相近的調酒。
- 📊 **原料分佈數據可視化**：整合 Chart.js 提供各類材料在整體酒譜中的使用頻率長條圖與圓餅圖分析。
- 🔐 **JWT 認證與管理員後台**：基於 SimpleJWT 實作無狀態 Token 驗證，提供安全完整的調酒及原料 CRUD 管理。
- 🌐 **中英雙語系切換 (i18n)**：全站介面支援中文繁體與英文動態即時切換。
- 🐳 **Docker 容器化支援**：提供完整的 `Dockerfile` 與 `docker-compose.yml`，一鍵快速建置後端與 PostgreSQL 環境。

---

## 🛠️ 系統技術棧 (Tech Stack)

### 後端技術棧 (Backend)
- **核心框架**：Django 4.1.9 + Django REST Framework 3.14.0
- **身份驗證**：SimpleJWT (JSON Web Token)
- **資料庫支援**：PostgreSQL (本地/Docker/Render 雲端) 搭配 SQLite 保底機制
- **容器化技術**：Docker & Docker Compose
- **機器學習/資料處理**：scikit-learn (CountVectorizer), pandas, numpy, joblib
- **部署平台**：Render (Web Service + Managed PostgreSQL)
- **其他套件**：django-environ (環境變數讀取), dj-database-url (資料庫連線解析), gunicorn (生產伺服器), pillow (圖片處理), whitenoise (生產環境靜態檔案託管)

### 前端技術棧 (Frontend)
- **核心框架**：React 18.2.0 & React DOM
- **路由管理**：React Router DOM v6.11.1
- **樣式與 UI**：Bootstrap 5.2.3 & React Bootstrap 2.7.4 & Sass
- **圖表繪製**：Chart.js & React Chartjs 2
- **多語系支援**：i18next & React i18next (支援中文、英文)
- **API 請求**：Axios (配有自訂的 token 刷新與自動附加 Authorization 標頭邏輯)

---

## 📂 完整專案目錄結構 (Project Directory Structure)

```text
cocktail-query/
├── backend/                               # Django REST Framework 後端服務
│   ├── api/                               # API 應用程式目錄
│   │   ├── fixtures/                      # 資料庫初始資料 (包含 cocktail_data.json)
│   │   ├── migrations/                    # 資料庫遷移檔 (含 0003 自動載入初始資料防呆)
│   │   ├── models.py                      # 資料庫模型 (Base, Liqueur, Alcohol, Ingredient, Cocktail)
│   │   ├── serializers.py                 # DRF 序列化器
│   │   ├── tests.py                       # API 端點單元測試
│   │   ├── urls.py                        # API 路由規則
│   │   ├── utils.py                       # 推薦系統模型訓練工具 (build_model)
│   │   └── views.py                       # API 視圖邏輯 (CRUD, 推薦, 備份, 圖表)
│   ├── backupData/                        # 資料庫備份檔存放目錄 (cocktail_data.json)
│   ├── cocktailData/                      # 機器學習模型與特徵 CSV 存放目錄 (cocktailModel.joblib)
│   ├── cocktail_query_drf/                # 專案核心設定目錄
│   │   ├── .env                           # 本地開發環境變數 (手動建立，請勿提交至 Git)
│   │   ├── settings.py                    # Django 全域設定 (含三層資料庫自動回退策略)
│   │   ├── urls.py                        # 主路由設定
│   │   └── wsgi.py / asgi.py              # 伺服器網關介面
│   ├── .env.example                       # 後端環境變數範本
│   ├── Dockerfile                         # Docker 映像檔建置規則 (含 collectstatic 與 WhiteNoise)
│   ├── docker-compose.yml                 # Docker 容器編排設定 (Web + PostgreSQL)
│   ├── build.sh                           # Render 雲端自動建置腳本
│   ├── manage.py                          # Django 命令行管理工具
│   └── requirements.txt                   # Python 套件依賴清單
│
├── frontend/                              # React 單頁式應用程式 (SPA)
│   ├── public/                            # 靜態資源 (HTML 樣本、圖示等)
│   ├── src/
│   │   ├── components/                    # 共享與通用元件
│   │   │   ├── AppNavbar.jsx              # 頂部導覽列（含語言切換、登入狀態）
│   │   │   ├── CocktailCard.jsx           # 雞尾酒卡片元件
│   │   │   ├── CocktailDetail.jsx         # 雞尾酒詳細資訊元件
│   │   │   ├── MaterialTable.jsx          # 原料表格元件
│   │   │   ├── MaterialBarChart.jsx       # 原料統計直條圖
│   │   │   └── ...
│   │   ├── context/                       # 全域 Context 狀態管理
│   │   │   └── AuthContext.js             # 登入與 Token 驗證狀態
│   │   ├── pages/                         # 頁面元件 (對應路由)
│   │   │   ├── Home.jsx                   # 首頁 (雞尾酒查詢)
│   │   │   ├── LoginPage.jsx              # 管理員登入頁面
│   │   │   ├── Cocktails.jsx              # 雞尾酒清單管理頁面 (需登入)
│   │   │   ├── Material.jsx               # 原料詳細資訊頁面
│   │   │   ├── Charts.jsx                 # 統計圖表頁面
│   │   │   └── ...
│   │   ├── translations/                  # 多語系語系檔
│   │   │   ├── chinese/                   # 中文翻譯 json
│   │   │   └── english/                   # 英文翻譯 json
│   │   ├── utils/                         # 工具函式與路由守衛
│   │   │   ├── PrivateRoute.js            # 路由守衛 (限制未登入使用者存取特定頁面)
│   │   │   ├── axiosInstance.js           # Axios 攔截器設定 (自動帶入與刷新 JWT)
│   │   │   └── cocktailPayloadUtils.js    # 雞尾酒表單 payload 處理工具
│   │   └── App.js                         # 路由定義與主要應用進入點
│   ├── .env.example                       # 前端環境變數範本
│   └── package.json                       # 前端依賴清單與腳本設定
│
├── LICENSE                                # 專案授權條款 (MIT License)
└── README.md                              # 專案完整技術文檔
```

---

## ⚡ 快速開始 (Quick Start)

### 1. 複製專案庫

```bash
git clone https://github.com/totorolin1999/cocktail-query.git
cd cocktail-query
```

---

### 2. 啟動後端 (Backend)

您可以選擇使用 **Docker 容器**（推薦）或 **原生 Python 虛擬環境**：

#### 方案 A：使用 Docker 容器啟動 (推薦)

```bash
cd backend
# 設定環境變數
cp .env.example cocktail_query_drf/.env

# 啟動 Web 與 PostgreSQL 容器
docker compose up -d

# 執行資料庫遷移（將自動套用欄位設定並自動匯入初始調酒資料，無需手動 loaddata）
docker compose exec web python manage.py migrate

# 建立超級管理員帳號
docker compose exec web python manage.py createsuperuser
```

> - 後端 API 服務：`http://127.0.0.1:8000`
> - Django 管理後台：`http://127.0.0.1:8000/admin/`

#### 方案 B：使用本機 Python 環境

```bash
cd backend
python -m venv venv
# 啟用虛擬環境 (Windows PowerShell)
venv\Scripts\Activate.ps1
# 啟用虛擬環境 (macOS / Linux)
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example cocktail_query_drf/.env

# 執行資料庫遷移（自動載入初始調酒資料）
python manage.py migrate
python manage.py createsuperuser

# 啟動開發伺服器
python manage.py runserver
```

> 💡 **資料庫連線小提示**：
> - **Docker 啟動（方案 A，推薦）**：自動注入 `DATABASE_URL` 連線至持久化 PostgreSQL 容器。
> - **本機原生啟動（方案 B）**：若未配置 PostgreSQL，系統將**自動優雅降級為 SQLite (`db.sqlite3`)**，零設定即可開箱體驗！
> - ⚠️ **注意**：SQLite 僅供本地輕量測試，換環境不隨 Git 同步；雲端部署請務必設定 `DATABASE_URL`（詳見下方 [核心資料庫連線機制](#-核心資料庫連線機制與-database_url)）。

---

### 3. 啟動前端 (Frontend)

開啟另一個終端機視窗：

```bash
cd frontend
# 設定環境變數
cp .env.example .env

# 安裝套件並啟動開發伺服器
npm install
npm start
```

> 瀏覽器將自動開啟 `http://localhost:3000`。
>
> 💡 **前端環境變數說明 (`frontend/.env`)**：
> ```env
> REACT_APP_APP_URL=http://127.0.0.1:8000
> # 部署至線上時的後端網址範例：
> # REACT_APP_APP_URL=https://your-backend-app.onrender.com
> ```

---

## 🧭 核心資料庫連線機制與 `DATABASE_URL`

本專案後端在 [`backend/cocktail_query_drf/settings.py`](backend/cocktail_query_drf/settings.py) 實作了靈活的 **「三層資料庫自動回退策略 (Database Fallback Strategy)」**，系統會依照環境變數有無 `DATABASE_URL` 自動切換連線目標：

### 三層資料庫自動回退策略與運作模式

| 模式 | `DATABASE_URL` 設定 | 實際連線資料庫 | 適用情境與說明 |
| :--- | :--- | :--- | :--- |
| **模式 A：URL 優先** | **已填寫**（如 `postgres://...`） | **PostgreSQL** (依 URL 指向) | • **Docker Compose**：容器自動注入 `DATABASE_URL=postgres://...@db:5432/...`<br>• **Render / 雲端部署**：雲端平台自動注入連線字串 |
| **模式 B：本地實體 DB** | **留空** (`DATABASE_URL=`)<br>+ 填寫 `PostgreSQL_*` 帳密 | **本地實體 PostgreSQL** | 本機 Windows/macOS 有安裝獨立 PostgreSQL 服務時使用 |
| **模式 C：零門檻體驗** | **留空** (`DATABASE_URL=`)<br>+ PostgreSQL 帳密留空 | **本機 SQLite (`db.sqlite3`)** | 新手開箱、不想開 Docker 也不想裝 DB 時的極速輕量測試 |

---

### 🚨 使用 SQLite 時的資料特性與消失風險

雖然 SQLite 具備免安裝、零設定的便利性，但有以下關鍵限制需特別注意：

1. **雲端容器的短暫性檔案系統 (Ephemeral Filesystem)**：
   - Render、Heroku 等 PaaS 平台的 Web 容器在閒置休眠喚醒或重新部署時，**整個磁碟會被重置還原為初始狀態**。
   - 若線上環境未配置 `DATABASE_URL` 而誤走 SQLite，**所有線上新增、修改的資料與帳號隨容器重啟將瞬間全數蒸發**！
2. **本機資料隔離與版本控制忽略**：
   - SQLite (`db.sqlite3`) 與 PostgreSQL 為彼此獨立的資料庫個體，資料不互通（若切換模式需重新執行 `migrate`）。
   - `db.sqlite3` 預設被 `.gitignore` 忽略，資料不會隨 Git 提交，換電腦或重新 Clone 時無法同步。
3. **並發寫入鎖定 (Database Lock)**：
   - SQLite 僅支援單一進程寫入鎖定，無法負荷生產環境 Gunicorn 多 Worker 同時寫入，易引發 `database is locked`。

> 💡 **最佳實踐**：
> - **本機免安裝極速體驗** ➔ 可利用 SQLite 開箱即用。
> - **主力開發 (Docker) 與雲端上線 (Render)** ➔ **務必提供 `DATABASE_URL`** 串接持久化的 PostgreSQL！

---

### 實體與 Docker 雙軌同步設定

為了確保本地端**實體電腦環境 (原生 venv)** 與 **Docker 容器環境** 100% 鏡像同步，本專案將兩者的 PostgreSQL 資料庫名稱、帳號與密碼完全對齊：
- **資料庫名稱**：`cocktail_db`
- **資料庫帳號**：`cocktail_user`
- **資料庫密碼**：`cocktail_password`

> ⚠️ **Port 5432 連接埠提醒**：
> 兩套模式在連向本機時都會佔用 **`5432` 埠**，同一時間只能擇一啟動：
> - 若使用**原生環境**：需啟動 Windows 實體 PostgreSQL 服務。
> - 若切換至 **Docker 環境**：需暫停 Windows 實體 PostgreSQL 服務，釋放 5432 埠給 Docker 容器。

---

## 💻 本地開發與維護指南 (Development & Maintenance)

### 🟢 後端模式一：原生實體環境配置
*適合時機：進行秒級反應的輕量修改、希望節省電腦耗電與記憶體時。*

#### 1. 本地 PostgreSQL 資料庫設定
1. 按下 `Win + R` 輸入 `services.msc`，確保本機 **`postgresql-x64-16`**（或對應版本）處於 **啟動 (Start)** 狀態。
2. 開啟 **pgAdmin 4** 以 `postgres` 管理員登入：
   - 建立 Login Role: `cocktail_user`，密碼設為 `cocktail_password`。
   - **關鍵授權 (CREATEDB)**：點擊 `cocktail_user` 右鍵 Properties ➔ Privileges ➔ 將 **`Can create database?`** (或 `CREATEDB`) 勾選為 **YES** *(此權限使 Django `test` 自動化測試能順利建立暫時資料庫)*。
   - 建立 Database: `cocktail_db`，擁有者 (Owner) 務必選為 **`cocktail_user`**。

#### 2. 環境變數設定 (`backend/cocktail_query_drf/.env`)
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
cd backend
# 執行自動化測試
python manage.py test

# 重新訓練/更新機器學習模型
python manage.py shell -c "from api.utils import build_model; build_model()"
```

---

### 🔵 後端模式二：Docker 容器環境日常維護
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
  docker compose exec web python manage.py migrate                      # 套用遷移（首次執行會自動匯入初始酒譜）
  docker compose exec web python manage.py createsuperuser              # 建立容器內超級管理員
  ```
- **下班關機（釋放 Port，資料仍儲存於 volume 不會遺失）**：
  ```bash
  docker compose down
  ```

---

### 🧪 前端測試專案 (Frontend Testing)

前端專案使用 Jest 與 React Testing Library 進行單元測試。請在 `frontend` 目錄下執行：

#### 執行互動式測試 (Watch Mode)
```bash
cd frontend
npm test
```

#### 執行單次測試 (CI 模式)
在部署或 CI/CD 自動化流程中，可使用以下命令執行單次完整測試：
```bash
cd frontend
npm test -- --watchAll=false
```

---

### 📦 前端專案打包 (Frontend Build)

當專案開發完成並準備部署至生產環境時，請在 `frontend` 目錄下執行打包命令：

```bash
cd frontend
npm run build
```

這將會在 `frontend` 目錄下生成一個 `build` 資料夾，其中包含經過壓縮、優化且已加上雜湊值 (Hash) 的靜態檔案，您可以直接將此資料夾部署至靜態網站託管服務（如 Netlify, Vercel, GitHub Pages 等）。

---

## 🤖 推薦系統機器學習模型 (Recommendation Engine)

本專案利用**自然語言處理 (NLP)** 技術實作酒譜推薦：

1. **特徵建置 (Feature Building)**：
   - 呼叫 [`backend/api/utils.py`](backend/api/utils.py) 中的 `build_model` 函數。
   - 該工具會讀取資料庫中所有 Cocktail 的基酒、利口酒、其他酒類、副材料名稱，整合成特徵字串並匯出為 CSV。
2. **相似度計算 (Cosine Similarity)**：
   - 利用 `CountVectorizer` 將酒譜原料轉換為詞頻向量，並計算雞尾酒之間的餘弦相似度。
   - 相似度矩陣以 `joblib` 序列化並儲存於 `backend/cocktailData/cocktailModel.joblib`。
3. **API 推薦服務**：
   - 請求 `/api/cocktail-recommendation/<pk>/` 時，系統載入 `joblib` 模型，比對輸入酒款與其他酒款的相似係數，取出相似度最高的前 9 款調酒（排除自身），序列化後回傳。

---

## 💾 資料備份與恢復機制 (Data Backup & Restore)

為避免手動維護測試資料的繁瑣，後端 API 提供了一鍵式備份端點：

- **端點路由**：`/api/backup-data/`
- **運作原理**：
  - 視圖 `backupData` ([`backend/api/views.py`](backend/api/views.py)) 會自動查詢資料庫中所有的基酒、利口酒、其他酒類、副材料以及雞尾酒資料。
  - 將其序列化為 Django 標準 fixture 的格式，並在 `backend/backupData/cocktail_data.json` 寫入。
  - 最後將該 JSON 檔作為附件回傳給請求者進行下載。
- **恢復方式**：可使用以下指令進行資料恢復：
  ```bash
  cd backend
  python manage.py loaddata backupData/cocktail_data.json
  ```

---

## ☁️ 部署至 Render 雲端平台完整指南 (Render Cloud Deployment)

本專案採用 `dj_database_url` 實作多棲資料庫設定，在 Render 部署時可選擇 **原生 Python 部署** 或 **Docker 部署**。

### Step 1：建立 Render PostgreSQL 託管資料庫
1. 登入 Render Dashboard，點擊 **New +** ➔ 選擇 **PostgreSQL**。
2. 配置資訊：
   - **Name**: `cocktail-prod-db`
   - **Database**: `cocktail_db`
   - **User**: `cocktail_user`
   - **Region**: 建議選 `Singapore` 或與您 Web Service 相同的區域。
3. 建立後，在控制面板中取得：
   - **Internal Database URL**（內部直連，用於同一 Region 的 Web Service 連線）
   - **External Database URL**（外部連線，用於本地端遠端維護）

---

### Step 2：選擇 Web Service 部署方案

#### 💡 方案 A：使用「原生 Python 環境」部署 (輕量快速)
1. **確認自動建置腳本 `build.sh`**：
   該腳本位於 `backend/build.sh`，會自動安裝依賴、收集靜態檔案並進行資料庫遷移：
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

### Step 3：資料庫自動遷移與初始資料載入 (已自動化)
現已在初始 fixture `backend/api/fixtures/cocktail_data.json` 中為所有資料完整指定唯一主鍵 `"pk"`，並透過 Django Data Migration (`0003_load_cocktail_fixtures.py`) 內建防呆檢查（僅在調酒表為空時載入）：

- **自動化運作**：Render 每次部署執行 `build.sh`（內含 `python manage.py migrate`）時，若為新資料庫將**自動且安全地載入初始資料**。
- **防止重複寫入**：若資料庫已有資料，Migration 會自動略過匯入，避免重複寫入或覆蓋後台維護的資料。

---

### Step 4：建立雲端超級管理員 (Superuser)

如需在雲端建立超級管理員帳號，可透過 Render Shell 或遠端連線執行：

```powershell
python manage.py createsuperuser
```

---

### Step 5：上線驗證
部署與初始化完成後，可透過 Render 提供的網址進行測試：
- **驗證 API 總覽**：`https://[你的專案名稱].onrender.com/api/`
- **驗證前端 API**：`https://[你的專案名稱].onrender.com/api/cocktail-list/`
- **後台登入**：`https://[你的專案名稱].onrender.com/admin/` (使用 Step 4 建立的雲端帳密)

---

## 📄 授權條款 (License)

本專案基於 [MIT License](LICENSE) 條款開放原始碼。
