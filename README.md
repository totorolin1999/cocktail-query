# 🍸 Cocktail Query — 雞尾酒查詢與智慧推薦系統

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.1.9-092E20.svg?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 一個現代化、前後端分離架構的雞尾酒查詢、數據可視化與智慧推薦平台。採用 **React** 搭配 **Django REST Framework**，並結合 **自然語言處理 (NLP) 餘弦相似度演算法**，為喜愛調酒的使用者提供精準的酒譜推薦與原料洞察。

---

## 🌟 主要功能亮點 (Key Features)

- 🔍 **多維度智能檢索**：支援依調酒名稱、六大基酒、利口酒、其他酒類及副材料進行即時交叉篩選。
- 🤖 **NLP 調酒推薦引擎**：運用 `scikit-learn` 將酒譜成份轉化為詞頻特徵向量，透過餘弦相似度（Cosine Similarity）推薦風格相近的調酒。
- 📊 **原料分佈數據可視化**：整合 Chart.js 提供各類材料在整體酒譜中的使用頻率長條圖與圓餅圖分析。
- 🔐 **JWT 認證與管理員後台**：基於 SimpleJWT 實作無狀態 Token 驗證，提供安全完整的調酒及原料 CRUD 管理。
- 🌐 **中英雙語系切換 (i18n)**：全站介面支援中文繁體與英文動態即時切換。
- 🐳 **Docker 容器化支援**：提供完整的 `Dockerfile` 與 `docker-compose.yml`，一鍵快速建置後端與 PostgreSQL 環境。

---

## 🏛️ 系統架構 (Architecture)

本專案採用前後端分離（Decoupled Architecture）設計：

```text
cocktail-query/
├── backend/                   # Django REST Framework 後端服務
│   ├── api/                   # API 視圖、資料模型與機器學習推薦邏輯
│   ├── cocktailData/          # 預先計算之特徵向量與相似度模型 (joblib)
│   ├── cocktail_query_drf/    # Django 專案核心設定 (settings, urls)
│   ├── docker-compose.yml     # 容器編排 (Web + PostgreSQL)
│   └── requirements.txt       # Python 依賴清單
│
├── frontend/                  # React 單頁式應用程式 (SPA)
│   ├── src/components/        # 共用 UI 元件 (卡片、圖表、導覽列)
│   ├── src/pages/             # 頁面元件 (首頁搜尋、推薦詳情、管理後台)
│   ├── src/context/           # AuthContext 全域登入狀態管理
│   ├── .env.example           # 前端環境變數範本
│   └── package.json           # 前端依賴清單
│
└── .gitignore                 # 根目錄全域忽略規則
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
> - ⚠️ **注意**：SQLite 僅供本地輕量測試，換環境不隨 Git 同步；雲端部署請務必設定 `DATABASE_URL`（詳見 [後端技術手冊](backend/README.md#🧭-核心資料庫連線機制與-database_url)）。

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

---

## 📚 詳細子目錄技術文檔

若需進一步了解後端推薦演算法原理、Render 雲端部署防禦機制或前端元件架構，請參閱各專案說明：

- 📖 **[後端完整技術手冊 (Backend Documentation)](backend/README.md)**
  - 餘弦相似度演算法實作細節
  - 資料庫雙棲切換架構（PostgreSQL & SQLite）
  - Render 雲端部署與初始化 SOP
- 📖 **[前端架構與使用手冊 (Frontend Documentation)](frontend/README.md)**
  - React 元件設計與路由守護（PrivateRoute）
  - Axios 攔截器與 Token 刷新機制
  - 多語系實作

---

## 📄 授權條款 (License)

本專案基於 [MIT License](LICENSE) 條款開放原始碼。
