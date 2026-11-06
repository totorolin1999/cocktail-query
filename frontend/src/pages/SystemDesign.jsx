import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useTranslation } from "react-i18next";

const TRANSLATIONS = {
  chinese: {
    badge_spec: "內部規格 / 展示用",
    title: "Cocktail Query — 系統設計與架構模擬器",
    subtitle:
      "深度剖析本專案在前後端分離、機器學習 NLP 調酒推薦引擎、三層資料庫自動回退容錯、無狀態 JWT 刷新機制與 Docker 容器化技術之實作細節。",
    btn_home: "返回前台首頁",
    kpi_arch_label: "架構模式",
    kpi_rec_label: "推薦引擎",
    kpi_db_label: "資料持久層容錯",
    kpi_auth_label: "安全認證機制",
    tabs: {
      arch: "🏗️ 全端拓撲與資料流",
      rec: "🤖 NLP 推薦演算法沙盒",
      db: "🛡️ 三層資料庫回退機制",
      jwt: "🔐 JWT 雙令牌無感刷新",
      docker: "🐳 雙軌與雲端部屬架構"
    },
    arch_section: {
      select_prompt: "點擊檢視各層設計與選型考量",
      detail_title: "節點深度解析",
      code_path: "程式檔案",
      highlights_title: "🛠️ 技術特點與工程實踐 (Key Highlights)",
      dataflow_title: "🔄 資料流向與互動關聯 (Data Flow)"
    },
    rec_section: {
      title: "🤖 調酒成份特徵向量化與餘弦相似度模擬器",
      desc: "模擬專案後端 scikit-learn 之 DictVectorizer + cosine_similarity 核心演算法（實時數學計算）。",
      target_cocktail: "🍸 基準調酒 (Target Cocktail A)",
      compare_cocktail: "🍹 對比調酒 (Comparison Cocktail B)",
      ingredients_label: "成份：",
      score_label: "計算所得相似度 (Cosine Similarity Score)",
      angle_label: "向量空間夾角餘弦值：",
      high_match: "高度強烈推薦 (High Match)",
      med_match: "風味相近推薦 (Moderate Match)",
      low_match: "低相關 / 風格迥異 (Low Match)",
      level_label: "相似度等級",
      common_features: "📌 特徵交集 (Common Ingredients)：",
      no_common: "無共同成分（兩款調酒在向量空間中相互正交）",
      math_title: "📐 演算法計算原理剖析",
      math_desc:
        "後端將每款調酒的成分轉換為高維度稀疏特徵向量（Vector A 與 Vector B），透過向量內積除以長度範數乘積計算夾角餘弦值：",
      why_model: "💡 為什麼選擇此模型而非深度神經網路？",
      reason_1: "即時運算極低延遲：相似度矩陣僅需約幾毫秒即可完成計算，適配雲端輕量主機。",
      reason_2: "完全杜絕冷啟動問題 (Cold Start)：任何新酒譜只要具備材料清單，無須依賴大量使用者瀏覽歷史紀錄即可立即獲得精準推薦。"
    },
    db_section: {
      title: "🛡️ 三層資料庫自動回退策略 (Database Fallback Strategy)",
      desc: "模擬 backend/cocktail_query_drf/settings.py 中的連線防呆與動態容錯狀態機。",
      prompt: "切換環境連線情境進行動態模擬：",
      btn_mode_a: "模式 A：URL 優先 (Docker / Render PostgreSQL)",
      btn_mode_b: "模式 B：本地實體獨立 PostgreSQL",
      btn_mode_c: "模式 C：本地 SQLite (零配置保底)",
      btn_trigger_down: "💥 觸發模擬連線中斷 (Simulate Timeout)",
      btn_down_active: "⚡ 模擬資料庫已中斷（觸發回退）",
      tier_1_title: "第一層：Managed PG",
      tier_1_active: "Active (連線中)",
      tier_1_lost: "Connection Lost",
      tier_1_standby: "Standby",
      tier_1_desc: "適用於 Render 託管資料庫或 Docker Compose 容器。高並發支援、交易完整性 (ACID)。",
      tier_2_title: "第二層：Local PG",
      tier_2_desc: "本機開發使用。連線本機 127.0.0.1:5432 獨立 PostgreSQL 伺服器實例。",
      tier_3_title: "第三層：SQLite Fallback",
      tier_3_failover: "⚡ Failover Triggered",
      tier_3_active: "Active (本地保底)",
      tier_3_safeguard: "Safe Guard",
      tier_3_desc_down: "主庫連線超時，後端自動降級使用本地 SQLite，確保查詢服務依然能順利運行！",
      tier_3_desc_normal: "零配置即時開箱體驗，完全免安裝外部資料庫軟體。",
      table_metric: "維度指標",
      table_concurrency: "並行讀寫支援 (Concurrency)",
      table_concurrency_pg: "高 (Row-Level Locking 行級鎖)",
      table_concurrency_sqlite: "中/低 (Database-Level Lock 資料庫鎖)",
      table_overhead: "記憶體與部署門檻",
      table_overhead_pg: "需啟動獨立守護進程 (Port 5432)",
      table_overhead_sqlite: "零門檻，單一二進位檔案嵌入式",
      table_durability: "雲端持久化特性",
      table_durability_pg: "託管雲磁碟，重啟不丟失資料",
      table_durability_sqlite: "雲端 Ephemeral 檔案系統重啟會還原"
    },
    jwt_section: {
      title: "🔐 JWT 雙令牌無狀態鑑權與 Axios 攔截器",
      desc: "模擬 frontend/src/utils/axiosInstance.js 實現的 Token 自動續約時序。",
      btn_next: "▶ 模擬推進下一步",
      btn_reset: "重置流程",
      steps: [
        {
          title: "1. 正常請求 (Normal Request)",
          desc: "前端發起 API 請求，Axios Request Interceptor 自動從 LocalStorage 讀取 Access Token，並附加 Authorization: Bearer <Token> 標頭。",
          status: "200 OK"
        },
        {
          title: "2. 權杖過期 (Token Expired)",
          desc: "Access Token 壽命到期（通常為數小時）。後端 DRF 驗證失敗，返回 HTTP 401 Unauthorized 狀態碼。",
          status: "401 Unauthorized"
        },
        {
          title: "3. 攔截器捕捉 (Axios Response Interceptor)",
          desc: "Axios 攔截器攔截到 401 錯誤，暫緩原始 Promise 請求，並自動使用 Refresh Token 向 /api/v1/auth/token/refresh/ 發起換證請求。",
          status: "Interception"
        },
        {
          title: "4. 換發新憑證 (Refresh Successful)",
          desc: "後端驗證 Refresh Token 有效性後，派發全新 Access Token；前端更新 LocalStorage 與 AuthContext 狀態。",
          status: "Token Renewed"
        },
        {
          title: "5. 原請求重發 (Request Replay)",
          desc: "將先前被暫停的原 API 請求替換成新 Token 後重新發送。使用者介面無中斷、無需重新登入！",
          status: "Seamless Retry"
        }
      ]
    },
    docker_section: {
      title: "🐳 雙軌本地開發與 Render 雲端架構對比",
      desc: "整合 Docker Compose 容器編排與 Render 雲端自動化託管環境。",
      track_1_badge: "軌道一：原生虛擬環境",
      track_1_title: "Python venv + npm start",
      track_1_points: [
        "• 零容器開銷，本機直讀程式碼熱重載",
        "• 預設自動搭配 SQLite 本地資料庫",
        "• 適合極速修復小 Bug 或單純介面除錯"
      ],
      track_2_badge: "軌道二：Docker 容器化 (推薦)",
      track_2_title: "Docker Compose 雙容器",
      track_2_points: [
        "• 隔離 Web 容器與 PostgreSQL 16 容器",
        "• 100% 抹平各作業系統 (Win/Mac/Linux) 環境差異",
        "• 啟動時自動跑 migrate 與資料注入"
      ],
      track_3_badge: "生產環境：Render Cloud",
      track_3_title: "Web Service + Managed DB",
      track_3_points: [
        "• Gunicorn + WhiteNoise 靜態檔案高速快取託管",
        "• 雲端自動注入 DATABASE_URL 與 SSL 加密連線",
        "• 支援健康探針與 CI/CD Git 自動觸發建置"
      ]
    }
  },
  english: {
    badge_spec: "Internal Spec / Showcase",
    title: "Cocktail Query — System Design & Interactive Sandbox",
    subtitle:
      "Deep architectural exploration of decoupled full-stack design, NLP cocktail recommendation engine, 3-tier database auto-fallback, silent JWT token renewal, and Docker containerization.",
    btn_home: "Back to Home",
    kpi_arch_label: "Architectural Pattern",
    kpi_rec_label: "Recommendation Engine",
    kpi_db_label: "Database Resilience",
    kpi_auth_label: "Security & Auth",
    tabs: {
      arch: "🏗️ Full-Stack Topology",
      rec: "🤖 NLP Recommendation Sandbox",
      db: "🛡️ 3-Tier Database Fallback",
      jwt: "🔐 Silent JWT Refresh Flow",
      docker: "🐳 Dual-Track & Cloud Deployment"
    },
    arch_section: {
      select_prompt: "Click a node to inspect its design & technical rationale",
      detail_title: "Deep Node Analysis",
      code_path: "Source Code",
      highlights_title: "🛠️ Key Highlights & Engineering Practices",
      dataflow_title: "🔄 Data Flow & Interactions"
    },
    rec_section: {
      title: "🤖 Ingredient Vectorization & Cosine Similarity Simulator",
      desc: "Simulates the backend scikit-learn DictVectorizer + cosine_similarity algorithm (Real-time math calculation).",
      target_cocktail: "🍸 Target Cocktail A",
      compare_cocktail: "🍹 Comparison Cocktail B",
      ingredients_label: "Ingredients:",
      score_label: "Computed Cosine Similarity Score",
      angle_label: "Cosine of angle in vector space:",
      high_match: "High Match (Strong Recommendation)",
      med_match: "Moderate Match (Flavor Profile Related)",
      low_match: "Low Match (Distinct Profile)",
      level_label: "Similarity Level",
      common_features: "📌 Common Ingredients:",
      no_common: "No overlapping ingredients (Orthogonal in vector space)",
      math_title: "📐 Mathematical Foundation & Formulation",
      math_desc:
        "The backend converts each cocktail recipe into a high-dimensional sparse vector (Vector A and Vector B) and computes the cosine of the angle between them:",
      why_model: "💡 Why this algorithm over deep neural networks?",
      reason_1: "Ultra-low latency: Similarity matrix computes in milliseconds, well suited for lightweight cloud instances.",
      reason_2: "Zero cold-start penalty: Any new cocktail with an ingredient list immediately integrates into recommendations without user interaction history."
    },
    db_section: {
      title: "🛡️ 3-Tier Database Auto-Fallback Strategy",
      desc: "Simulates connection resilience and dynamic failover state machine in backend/cocktail_query_drf/settings.py.",
      prompt: "Simulate different environment connection scenarios dynamically:",
      btn_mode_a: "Mode A: URL Priority (Docker / Render PostgreSQL)",
      btn_mode_b: "Mode B: Local Standalone PostgreSQL",
      btn_mode_c: "Mode C: Local SQLite (Zero-Config Safeguard)",
      btn_trigger_down: "💥 Trigger Connection Timeout (Simulate Failure)",
      btn_down_active: "⚡ Database Connection Lost (Failover Active)",
      tier_1_title: "Tier 1: Managed PG",
      tier_1_active: "Active (Connected)",
      tier_1_lost: "Connection Lost",
      tier_1_standby: "Standby",
      tier_1_desc: "Used in Render Managed DB or Docker Compose. Full ACID compliance and high concurrency.",
      tier_2_title: "Tier 2: Local PG",
      tier_2_desc: "Used in local development with standalone PostgreSQL instance on 127.0.0.1:5432.",
      tier_3_title: "Tier 3: SQLite Fallback",
      tier_3_failover: "⚡ Failover Triggered",
      tier_3_active: "Active (Local Safeguard)",
      tier_3_safeguard: "Safe Guard",
      tier_3_desc_down: "Primary DB timed out! Backend seamlessly downgraded to local SQLite to keep read queries operational.",
      tier_3_desc_normal: "Zero-configuration out-of-the-box experience, no external DB server installation required.",
      table_metric: "Evaluation Metrics",
      table_concurrency: "Concurrency Support",
      table_concurrency_pg: "High (Row-Level Locking)",
      table_concurrency_sqlite: "Moderate / Low (Database-Level Lock)",
      table_overhead: "Memory & Setup Overhead",
      table_overhead_pg: "Requires running daemon (Port 5432)",
      table_overhead_sqlite: "Zero setup, embedded single binary file",
      table_durability: "Cloud Durability",
      table_durability_pg: "Persistent managed disk, data survives reboots",
      table_durability_sqlite: "Ephemeral filesystem resets upon dyno restart"
    },
    jwt_section: {
      title: "🔐 Stateless JWT Auth & Axios Interceptor Pipeline",
      desc: "Simulates silent token renewal sequence implemented in frontend/src/utils/axiosInstance.js.",
      btn_next: "▶ Step Forward",
      btn_reset: "Reset Sequence",
      steps: [
        {
          title: "1. Normal Request",
          desc: "Frontend sends API request. Axios Request Interceptor attaches Authorization: Bearer <Access Token> from LocalStorage.",
          status: "200 OK"
        },
        {
          title: "2. Token Expired",
          desc: "Short-lived Access Token expires. Django DRF rejects the request and responds with HTTP 401 Unauthorized.",
          status: "401 Unauthorized"
        },
        {
          title: "3. Axios Response Interception",
          desc: "Axios interceptor catches 401, pauses current request queue, and calls /api/v1/auth/token/refresh/ using Refresh Token.",
          status: "Interception"
        },
        {
          title: "4. New Access Token Issued",
          desc: "Backend validates Refresh Token and issues a fresh Access Token. Frontend updates LocalStorage & AuthContext.",
          status: "Token Renewed"
        },
        {
          title: "5. Seamless Request Replay",
          desc: "The paused original request is automatically retried with the newly minted token. User experience remains uninterrupted!",
          status: "Seamless Retry"
        }
      ]
    },
    docker_section: {
      title: "🐳 Dual-Track Local Development & Render Cloud Architecture",
      desc: "Comparison of Docker Compose container orchestration vs Render cloud hosting.",
      track_1_badge: "Track 1: Native Virtualenv",
      track_1_title: "Python venv + npm start",
      track_1_points: [
        "• Zero container overhead, direct host hot-reloading",
        "• Defaults to local embedded SQLite database",
        "• Ideal for rapid UI tweaks or single-file debugging"
      ],
      track_2_badge: "Track 2: Containerized (Recommended)",
      track_2_title: "Docker Compose Multi-Container",
      track_2_points: [
        "• Isolates Web service container and PostgreSQL 16 container",
        "• Eliminates OS-level discrepancies across Win/Mac/Linux",
        "• Automatic migrations & fixture data seeding on startup"
      ],
      track_3_badge: "Production: Render Cloud",
      track_3_title: "Web Service + Managed DB",
      track_3_points: [
        "• Gunicorn + WhiteNoise for high-performance static asset caching",
        "• Automated injection of DATABASE_URL with SSL encryption",
        "• Health check probes and automated Git push CI/CD deployments"
      ]
    }
  }
};

const getSystemNodes = (isEn) => [
  {
    id: "frontend",
    title: isEn ? "Client Tier (Frontend SPA)" : "前端客戶端 (Client Tier)",
    tech: "React 18 + React Router + Bootstrap & Sass + Chart.js + i18next",
    badge: "SPA / PWA Ready",
    summary: isEn
      ? "Responsive Single Page Application (SPA) offering multi-dimensional search, ingredient analytics, and admin dashboard."
      : "響應式單頁應用 (SPA)，負責多維度酒譜檢索、原料視覺化圖表與管理員儀表板。",
    highlights: isEn
      ? [
          "Decoupled frontend architecture with centralized Axios API client",
          "Dual-token (Access + Refresh) silent refresh and Bearer header injection",
          "Real-time Chinese / English bilingual internationalization (i18n)",
          "Chart.js interactive visualizations for liquor & ingredient breakdown"
        ]
      : [
          "前後端分離設計，透過 Axios 統一封裝 API 請求",
          "雙令牌 (Access + Refresh Token) 靜默刷新與 JWT 自動注入",
          "中英雙語系即時切換 (i18n)，不需重整頁面",
          "Chart.js 多維度呈現基酒與原料佔比分佈"
        ],
    dataflow: isEn
      ? "User interacts with search filters → Axios interceptor validates & injects Bearer JWT → Dispatches HTTP request to DRF → React virtual DOM updates & Chart.js renders charts."
      : "使用者在前端介面發起篩選或查看調酒 → Axios 攔截器檢查並注入 JWT Bearer Token → 向 DRF API 傳送請求 → 取得酒譜 JSON 後由 React 進行虛擬 DOM 渲染與 Chart.js 動態繪製。",
    path: "frontend/src/"
  },
  {
    id: "gateway",
    title: isEn ? "API Gateway & Backend Tier" : "API 網關與應用後端 (Backend Tier)",
    tech: "Django 4.1 + Django REST Framework + SimpleJWT + Gunicorn",
    badge: "RESTful API",
    summary: isEn
      ? "High-availability, stateless RESTful API handling business logic, data validation, and permission controls."
      : "提供高可用性、無狀態的 RESTful API，負責業務邏輯處理、資料驗證與權限控管。",
    highlights: isEn
      ? [
          "DRF ViewSets and Serializers ensure strict schema validation",
          "SimpleJWT implements stateless token auth, eliminating server session affinity",
          "WhiteNoise delivers static file compression and caching in production",
          "Automated DB migration pipeline with 102 IBA classic recipe fixtures"
        ]
      : [
          "DRF ViewSets 與 Serializers 提供嚴格資料結構驗證",
          "SimpleJWT 實作無狀態 Token 鑑權，降低伺服器 Session 負擔",
          "WhiteNoise 處理生產環境靜態資源託管",
          "自動化 Migration 機制，支援 IBA 官方 102 款經典酒譜初始化"
        ],
    dataflow: isEn
      ? "Receives incoming HTTP requests → Authenticates through SimpleJWT middleware → Validates with DRF Serializers → Queries ORM models → Returns clean JSON responses."
      : "接收前端 HTTP 請求 → 經 SimpleJWT 中間件鑑權 → DRF Serializer 解析與校驗 → 查詢關聯資料庫模型 (Cocktail, Material, RecipeItem) → 序列化為統一格式 JSON 回傳。",
    path: "backend/api/views.py"
  },
  {
    id: "ml",
    title: isEn ? "Recommendation Engine" : "智慧推薦引擎 (Recommendation Engine)",
    tech: "scikit-learn (DictVectorizer + Cosine Similarity) + pandas",
    badge: "NLP Content-Based",
    summary: isEn
      ? "Content-based vector space model calculating recipe flavor and ingredient cosine similarities."
      : "以成份內容為基礎 (Content-Based) 的向量化空間模型，計算酒譜風味特徵相似度。",
    highlights: isEn
      ? [
          "DictVectorizer encodes multi-dimensional ingredient feature space",
          "Cosine similarity matrix calculates spatial angles between recipes",
          "Sub-millisecond retrieval: precomputed similarity matrix for Top 9 recommendations",
          "Cold-start resilient: newly created cocktails immediately participate in recommendations"
        ]
      : [
          "離線/即時特徵字典向量化 (DictVectorizer) 映射原料維度",
          "餘弦相似度 (Cosine Similarity) 矩陣，計算高維空間夾角",
          "零延遲響應：預載相似度矩陣，提供 Top 9 風格相近酒譜",
          "冷啟動友善：新調酒只要具備配方成份，即可立即融入推薦體系"
        ],
    dataflow: isEn
      ? "When invoking /api/v1/cocktails/<id>/recommendations/<id>, the view queries the preloaded similarity_df matrix, extracts top 9 recipe IDs, and retrieves structured cocktails via ORM."
      : "當呼叫 /api/v1/cocktails/<id>/recommendations/<id> 時，後端載入由 DictVectorizer 產生的 similarity_df 餘弦相似度矩陣，瞬間檢索 Top 9 相近酒譜 ID，再由 ORM 批次抓取詳情回傳。",
    path: "backend/api/views.py (cocktailRecommendation)"
  },
  {
    id: "database",
    title: isEn ? "Data Persistence Tier" : "資料持久層 (Data Persistence Tier)",
    tech: "PostgreSQL 16 (Primary) + SQLite (Fallback Safeguard)",
    badge: "3-Tier Auto-Fallback",
    summary: isEn
      ? "Three-tier dynamic fallback strategy auto-switching between Managed PG, Docker PG, or Local SQLite."
      : "三層自動回退策略，依據環境變數動態切換 Managed PG、Docker PG 或 Local SQLite。",
    highlights: isEn
      ? [
          "Production utilizes Render Managed PostgreSQL with connection pooling",
          "Docker Compose orchestrates standalone PostgreSQL instance on port 5432",
          "Zero-friction fallback: automatically defaults to SQLite (db.sqlite3) if DB is unset",
          "Structured foreign keys linking materials, units, and categories"
        ]
      : [
          "生產環境採用 Render 託管 PostgreSQL，支援連線池與高並發",
          "Docker Compose 提供容器化獨立 PostgreSQL 實例 (Port 5432)",
          "極速體驗：未配置資料庫時自動無縫回退至 SQLite (db.sqlite3)",
          "JSONB / 結構化 Foreign Key 關聯材料、類別與計量單位"
        ],
    dataflow: isEn
      ? "Django reads settings.py at startup. If DATABASE_URL is valid, it connects to PostgreSQL; otherwise it automatically falls back to local db.sqlite3 without throwing fatal errors."
      : "Django 啟動時讀取 settings.py 連線設定。若 DATABASE_URL 存在則連線至 PostgreSQL；若連線失敗或處於原生離線模式，則自動切換為本地 db.sqlite3，保證系統不當機。",
    path: "backend/cocktail_query_drf/settings.py"
  },
  {
    id: "devops",
    title: isEn ? "Containerization & Cloud Tier" : "容器化與部屬架構 (DevOps Tier)",
    tech: "Docker & Docker Compose + Render Cloud Web Service",
    badge: "Containerized",
    summary: isEn
      ? "Supports dual-track local development (native virtualenv & Docker) and Render cloud CI/CD deployment."
      : "支援本機雙軌開發（原生 venv 與 Docker 容器）與 Render 雲端自動化持續部署。",
    highlights: isEn
      ? [
          "docker-compose.yml orchestrates both Django and PostgreSQL containers with 1 command",
          "Render Web Service + Managed DB continuous zero-downtime deployment",
          "Environment variable guard rails preventing missing credentials",
          "Built-in database backup & restoration endpoints"
        ]
      : [
          "docker-compose.yml 一鍵編排後端服務與 PostgreSQL 容器",
          "Render Web Service + Managed DB 雲端零停機部署配置",
          "三層環境變數防禦，防止部署時資料庫連線中斷或憑證遺失",
          "完整資料庫備份與恢復機制 (backupData & restoreData)"
        ],
    dataflow: isEn
      ? "docker-compose.yml links web and db services across an internal Docker network, triggering migrations and recipe seeding automatically on container spin-up."
      : "docker-compose.yml 定義了 web (Django) 與 db (PostgreSQL 16) 服務，透過內部 Docker 網路自動解析資料庫主機名，啟動時依序自動執行 migration 與 fixture 資料匯入。",
    path: "docker-compose.yml"
  }
];

const PRESET_RECIPES = {
  "Dry Martini": {
    name_zh: "Dry Martini (馬丁尼)",
    name_en: "Dry Martini",
    ingredients_zh: { "琴酒 (Gin)": 60, "乾苦艾酒 (Dry Vermouth)": 10, "橄欖/檸檬皮": 1 },
    ingredients_en: { "Gin": 60, "Dry Vermouth": 10, "Olive / Lemon peel": 1 }
  },
  "Negroni": {
    name_zh: "Negroni (內格羅尼)",
    name_en: "Negroni",
    ingredients_zh: { "琴酒 (Gin)": 30, "甜苦艾酒 (Sweet Vermouth)": 30, "金巴利 (Campari)": 30 },
    ingredients_en: { "Gin": 30, "Sweet Vermouth": 30, "Campari": 30 }
  },
  "Boulevardier": {
    name_zh: "Boulevardier (花花公子)",
    name_en: "Boulevardier",
    ingredients_zh: { "波本威士忌 (Bourbon)": 45, "甜苦艾酒 (Sweet Vermouth)": 30, "金巴利 (Campari)": 30 },
    ingredients_en: { "Bourbon": 45, "Sweet Vermouth": 30, "Campari": 30 }
  },
  "Manhattan": {
    name_zh: "Manhattan (曼哈頓)",
    name_en: "Manhattan",
    ingredients_zh: { "黑麥威士忌 (Rye Whiskey)": 50, "甜苦艾酒 (Sweet Vermouth)": 20, "安格仕苦精": 2 },
    ingredients_en: { "Rye Whiskey": 50, "Sweet Vermouth": 20, "Angostura Bitters": 2 }
  },
  "Gin Tonic": {
    name_zh: "Gin Tonic (琴通寧)",
    name_en: "Gin Tonic",
    ingredients_zh: { "琴酒 (Gin)": 45, "通寧水 (Tonic Water)": 120, "檸檬角": 1 },
    ingredients_en: { "Gin": 45, "Tonic Water": 120, "Lime wedge": 1 }
  },
  "Margarita": {
    name_zh: "Margarita (瑪格麗特)",
    name_en: "Margarita",
    ingredients_zh: { "龍舌蘭 (Tequila)": 50, "君度橙酒 (Cointreau)": 20, "萊姆汁 (Lime Juice)": 15 },
    ingredients_en: { "Tequila": 50, "Cointreau": 20, "Lime Juice": 15 }
  }
};

const ALL_INGREDIENT_POOL = [
  "琴酒 (Gin)",
  "甜苦艾酒 (Sweet Vermouth)",
  "乾苦艾酒 (Dry Vermouth)",
  "金巴利 (Campari)",
  "波本威士忌 (Bourbon)",
  "黑麥威士忌 (Rye Whiskey)",
  "通寧水 (Tonic Water)",
  "龍舌蘭 (Tequila)",
  "君度橙酒 (Cointreau)",
  "萊姆汁 (Lime Juice)",
  "安格仕苦精",
  "橄欖/檸檬皮"
];

const SystemDesign = () => {
  const [, i18n] = useTranslation("global");
  const isEn = i18n.language === "english";
  const tr = isEn ? TRANSLATIONS.english : TRANSLATIONS.chinese;

  const [activeTab, setActiveTab] = useState("architecture");
  const systemNodes = useMemo(() => getSystemNodes(isEn), [isEn]);
  const [selectedNodeId, setSelectedNodeId] = useState("frontend");

  // Tab 2: 推薦演算法沙盒狀態
  const [cocktailA, setCocktailA] = useState("Negroni");
  const [cocktailB, setCocktailB] = useState("Boulevardier");

  // Tab 3: 資料庫 Fallback 狀態模擬
  const [dbMode, setDbMode] = useState("mode_a");
  const [isDbDown, setIsDbDown] = useState(false);

  // Tab 4: JWT 刷新步進模擬
  const [jwtStep, setJwtStep] = useState(0);

  const selectedNode = useMemo(() => {
    return systemNodes.find((n) => n.id === selectedNodeId) || systemNodes[0];
  }, [systemNodes, selectedNodeId]);

  // 計算沙盒餘弦相似度
  const similarityResult = useMemo(() => {
    const ingA = PRESET_RECIPES[cocktailA]?.ingredients_zh || {};
    const ingB = PRESET_RECIPES[cocktailB]?.ingredients_zh || {};

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    ALL_INGREDIENT_POOL.forEach((item) => {
      const valA = ingA[item] ? 1 : 0;
      const valB = ingB[item] ? 1 : 0;
      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    });

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    const score = magnitude === 0 ? 0 : dotProduct / magnitude;
    const commonIngredients = Object.keys(ingA).filter((k) =>
      Object.prototype.hasOwnProperty.call(ingB, k)
    );

    return {
      score: (score * 100).toFixed(1),
      decimalScore: score.toFixed(4),
      dotProduct,
      magnitude: magnitude.toFixed(3),
      commonIngredients,
      ingredientsA: isEn
        ? Object.keys(PRESET_RECIPES[cocktailA]?.ingredients_en || {})
        : Object.keys(ingA),
      ingredientsB: isEn
        ? Object.keys(PRESET_RECIPES[cocktailB]?.ingredients_en || {})
        : Object.keys(ingB)
    };
  }, [cocktailA, cocktailB, isEn]);

  return (
    <Container className="py-4 system-design-page" style={{ maxWidth: "1240px" }}>
      {/* 頂部 Header & 快速指標 */}
      <div
        className="p-4 mb-4 rounded-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(22, 22, 74, 0.95) 0%, rgba(15, 15, 61, 0.98) 100%)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)"
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <Badge bg="warning" text="dark" className="px-2 py-1 fw-bold">
                SYSTEM DESIGN & ARCHITECTURE
              </Badge>
              <Badge bg="secondary" className="px-2 py-1">
                {tr.badge_spec}
              </Badge>
            </div>
            <h1 className="h2 text-white fw-bold mb-1" style={{ letterSpacing: "-0.5px" }}>
              {tr.title}
            </h1>
            <p className="text-muted mb-0" style={{ maxWidth: "800px", fontSize: "0.95rem" }}>
              {tr.subtitle}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button as={Link} to="/" variant="outline-light" size="sm">
              {tr.btn_home}
            </Button>
          </div>
        </div>

        {/* 核心技術亮點 KPI 徽章 */}
        <Row className="g-3 mt-3">
          <Col xs={6} md={3}>
            <div
              className="p-3 rounded-3 h-100"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <div className="text-muted small">{tr.kpi_arch_label}</div>
              <div className="fw-bold text-white mt-1">Decoupled Full-Stack</div>
              <div className="text-warning small mt-1">React 18 + DRF RESTful</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div
              className="p-3 rounded-3 h-100"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <div className="text-muted small">{tr.kpi_rec_label}</div>
              <div className="fw-bold text-white mt-1">NLP Content-Based</div>
              <div className="text-warning small mt-1">Cosine Vector Similarity</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div
              className="p-3 rounded-3 h-100"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <div className="text-muted small">{tr.kpi_db_label}</div>
              <div className="fw-bold text-white mt-1">3-Tier Fallback</div>
              <div className="text-warning small mt-1">Managed PG → Local PG → SQLite</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div
              className="p-3 rounded-3 h-100"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <div className="text-muted small">{tr.kpi_auth_label}</div>
              <div className="fw-bold text-white mt-1">Stateless SimpleJWT</div>
              <div className="text-warning small mt-1">Axios Interceptor Silent Refresh</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 導覽 Tabs */}
      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 p-2 rounded-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          gap: "8px"
        }}
      >
        <Nav.Item>
          <Nav.Link eventKey="architecture" className="text-light">
            {tr.tabs.arch}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="recommendation" className="text-light">
            {tr.tabs.rec}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="database" className="text-light">
            {tr.tabs.db}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="jwt" className="text-light">
            {tr.tabs.jwt}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="docker" className="text-light">
            {tr.tabs.docker}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* TAB 1: 全端拓撲與資料流 */}
      {activeTab === "architecture" && (
        <div>
          <Row className="g-4">
            <Col lg={5}>
              <Card
                className="h-100 border-0"
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                <Card.Header className="bg-transparent border-0 pt-3 pb-2">
                  <span className="text-warning fw-bold small text-uppercase">
                    {tr.arch_section.select_prompt}
                  </span>
                  <h3 className="h5 text-white mb-0 mt-1">{tr.tabs.arch}</h3>
                </Card.Header>
                <Card.Body className="d-flex flex-column gap-2 pt-0">
                  {systemNodes.map((node) => {
                    const isSelected = selectedNode.id === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        style={{
                          cursor: "pointer",
                          padding: "14px 16px",
                          borderRadius: "var(--radius-sm)",
                          background: isSelected
                            ? "rgba(232, 168, 56, 0.15)"
                            : "rgba(255, 255, 255, 0.03)",
                          border: isSelected
                            ? "1px solid var(--color-accent)"
                            : "1px solid rgba(255, 255, 255, 0.07)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className={`fw-bold ${isSelected ? "text-warning" : "text-light"}`}>
                            {node.title}
                          </span>
                          <Badge
                            bg={isSelected ? "warning" : "secondary"}
                            text={isSelected ? "dark" : "light"}
                          >
                            {node.badge}
                          </Badge>
                        </div>
                        <div className="text-muted small mt-1">{node.tech}</div>
                      </div>
                    );
                  })}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={7}>
              <Card
                className="h-100 border-0"
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                <Card.Header className="bg-transparent border-0 pt-3 pb-2 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-warning fw-bold small text-uppercase">
                      {tr.arch_section.detail_title}
                    </span>
                    <h3 className="h4 text-white mb-0 mt-1">{selectedNode.title}</h3>
                  </div>
                  <Badge bg="info" className="px-3 py-2">
                    {tr.arch_section.code_path}: {selectedNode.path}
                  </Badge>
                </Card.Header>
                <Card.Body className="pt-2">
                  <div
                    className="p-3 rounded-3 mb-3"
                    style={{
                      background: "rgba(0, 0, 0, 0.25)",
                      borderLeft: "4px solid var(--color-accent)"
                    }}
                  >
                    <div className="text-light fw-medium">{selectedNode.summary}</div>
                  </div>

                  <h4 className="h6 text-warning mb-3">{tr.arch_section.highlights_title}</h4>
                  <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                    {selectedNode.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="d-flex align-items-start gap-2 text-light"
                        style={{ fontSize: "0.92rem" }}
                      >
                        <span className="text-warning">✔</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="h6 text-warning mb-2">{tr.arch_section.dataflow_title}</h4>
                  <div
                    className="p-3 rounded-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <p className="small text-muted mb-0">{selectedNode.dataflow}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* TAB 2: NLP 推薦演算法沙盒 */}
      {activeTab === "recommendation" && (
        <div>
          <Card
            className="border-0 mb-4"
            style={{
              background: "var(--color-surface-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h3 className="h4 text-white fw-bold mb-1">{tr.rec_section.title}</h3>
                  <p className="text-muted small mb-0">{tr.rec_section.desc}</p>
                </div>
                <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold">
                  Mathematical Sandbox
                </Badge>
              </div>

              {/* 選擇兩種酒譜進行比對 */}
              <Row className="g-3 my-2">
                <Col md={6}>
                  <div
                    className="p-3 rounded-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <label className="form-label text-warning fw-bold">
                      {tr.rec_section.target_cocktail}
                    </label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={cocktailA}
                      onChange={(e) => setCocktailA(e.target.value)}
                    >
                      {Object.keys(PRESET_RECIPES).map((key) => (
                        <option key={key} value={key}>
                          {isEn ? PRESET_RECIPES[key].name_en : PRESET_RECIPES[key].name_zh}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-muted small">
                      {tr.rec_section.ingredients_label} {similarityResult.ingredientsA.join("、")}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div
                    className="p-3 rounded-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <label className="form-label text-warning fw-bold">
                      {tr.rec_section.compare_cocktail}
                    </label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={cocktailB}
                      onChange={(e) => setCocktailB(e.target.value)}
                    >
                      {Object.keys(PRESET_RECIPES).map((key) => (
                        <option key={key} value={key}>
                          {isEn ? PRESET_RECIPES[key].name_en : PRESET_RECIPES[key].name_zh}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-muted small">
                      {tr.rec_section.ingredients_label} {similarityResult.ingredientsB.join("、")}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* 相似度計量展示儀表 */}
              <div
                className="p-4 my-4 rounded-4"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(15, 15, 61, 0.8), rgba(26, 26, 94, 0.8))",
                  border: "1px solid var(--color-border)"
                }}
              >
                <Row className="align-items-center g-4">
                  <Col md={5} className="text-center text-md-start">
                    <span className="text-muted small text-uppercase">
                      {tr.rec_section.score_label}
                    </span>
                    <div className="display-4 fw-bold text-warning my-1">
                      {similarityResult.score}%
                    </div>
                    <div className="text-light small">
                      {tr.rec_section.angle_label}{" "}
                      <code className="text-info">{similarityResult.decimalScore}</code>
                    </div>
                    <div className="mt-2">
                      {parseFloat(similarityResult.score) >= 70 ? (
                        <Badge bg="success" className="px-3 py-1">
                          {tr.rec_section.high_match}
                        </Badge>
                      ) : parseFloat(similarityResult.score) >= 40 ? (
                        <Badge bg="info" className="px-3 py-1">
                          {tr.rec_section.med_match}
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="px-3 py-1">
                          {tr.rec_section.low_match}
                        </Badge>
                      )}
                    </div>
                  </Col>

                  <Col md={7}>
                    <div className="mb-2 d-flex justify-content-between text-light small">
                      <span>{tr.rec_section.level_label}</span>
                      <span>{similarityResult.score}%</span>
                    </div>
                    <ProgressBar
                      now={parseFloat(similarityResult.score)}
                      variant={parseFloat(similarityResult.score) >= 60 ? "warning" : "info"}
                      style={{ height: "14px" }}
                      className="rounded-pill"
                    />

                    <div className="mt-3 p-3 rounded-3" style={{ background: "rgba(0,0,0,0.3)" }}>
                      <div className="text-warning small fw-bold mb-1">
                        {tr.rec_section.common_features}
                      </div>
                      <div className="text-light small">
                        {similarityResult.commonIngredients.length > 0 ? (
                          similarityResult.commonIngredients.map((item, i) => (
                            <Badge key={i} bg="warning" text="dark" className="me-1 mb-1">
                              {item}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted">{tr.rec_section.no_common}</span>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* 數學原理與公式 */}
              <div
                className="p-3 rounded-3"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                <h4 className="h6 text-warning mb-2">{tr.rec_section.math_title}</h4>
                <p className="text-muted small mb-2">{tr.rec_section.math_desc}</p>
                <div className="text-center p-2 my-2 rounded bg-black text-warning font-monospace small">
                  Cosine Similarity = ( A · B ) / ( ||A|| × ||B|| ) = {similarityResult.dotProduct}{" "}
                  / {similarityResult.magnitude} = {similarityResult.decimalScore}
                </div>
                <div className="text-muted small">
                  <strong>{tr.rec_section.why_model}</strong>
                  <ul className="mb-0 mt-1">
                    <li>
                      <strong>{tr.rec_section.reason_1}</strong>
                    </li>
                    <li>
                      <strong>{tr.rec_section.reason_2}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* TAB 3: 三層資料庫回退機制 */}
      {activeTab === "database" && (
        <div>
          <Card
            className="border-0 mb-4"
            style={{
              background: "var(--color-surface-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h3 className="h4 text-white fw-bold mb-1">{tr.db_section.title}</h3>
                  <p className="text-muted small mb-0">{tr.db_section.desc}</p>
                </div>
                <Badge bg="success" className="px-3 py-2">
                  Zero-Downtime Design
                </Badge>
              </div>

              {/* 互動切換模式 */}
              <div className="mb-4">
                <span className="text-warning small fw-bold text-uppercase d-block mb-2">
                  {tr.db_section.prompt}
                </span>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant={dbMode === "mode_a" ? "warning" : "outline-light"}
                    size="sm"
                    onClick={() => {
                      setDbMode("mode_a");
                      setIsDbDown(false);
                    }}
                  >
                    {tr.db_section.btn_mode_a}
                  </Button>
                  <Button
                    variant={dbMode === "mode_b" ? "warning" : "outline-light"}
                    size="sm"
                    onClick={() => {
                      setDbMode("mode_b");
                      setIsDbDown(false);
                    }}
                  >
                    {tr.db_section.btn_mode_b}
                  </Button>
                  <Button
                    variant={dbMode === "mode_c" ? "warning" : "outline-light"}
                    size="sm"
                    onClick={() => {
                      setDbMode("mode_c");
                      setIsDbDown(false);
                    }}
                  >
                    {tr.db_section.btn_mode_c}
                  </Button>
                  <Button
                    variant={isDbDown ? "danger" : "outline-danger"}
                    size="sm"
                    onClick={() => setIsDbDown(!isDbDown)}
                  >
                    {isDbDown ? tr.db_section.btn_down_active : tr.db_section.btn_trigger_down}
                  </Button>
                </div>
              </div>

              {/* 視覺化三層架構狀態 */}
              <Row className="g-3">
                <Col md={4}>
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{
                      background:
                        !isDbDown && dbMode === "mode_a"
                          ? "rgba(74, 222, 128, 0.1)"
                          : isDbDown
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(255, 255, 255, 0.02)",
                      border:
                        !isDbDown && dbMode === "mode_a"
                          ? "2px solid #4ade80"
                          : isDbDown
                          ? "2px dashed #ef4444"
                          : "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-light">{tr.db_section.tier_1_title}</span>
                      <Badge
                        bg={
                          !isDbDown && dbMode === "mode_a"
                            ? "success"
                            : isDbDown
                            ? "danger"
                            : "secondary"
                        }
                      >
                        {!isDbDown && dbMode === "mode_a"
                          ? tr.db_section.tier_1_active
                          : isDbDown
                          ? tr.db_section.tier_1_lost
                          : tr.db_section.tier_1_standby}
                      </Badge>
                    </div>
                    <div className="text-muted small mt-2">
                      環境變數：<code>DATABASE_URL=postgres://...</code>
                    </div>
                    <div className="small text-light mt-2">{tr.db_section.tier_1_desc}</div>
                  </div>
                </Col>

                <Col md={4}>
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{
                      background:
                        !isDbDown && dbMode === "mode_b"
                          ? "rgba(74, 222, 128, 0.1)"
                          : "rgba(255, 255, 255, 0.02)",
                      border:
                        !isDbDown && dbMode === "mode_b"
                          ? "2px solid #4ade80"
                          : "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-light">{tr.db_section.tier_2_title}</span>
                      <Badge bg={!isDbDown && dbMode === "mode_b" ? "success" : "secondary"}>
                        {!isDbDown && dbMode === "mode_b"
                          ? tr.db_section.tier_1_active
                          : tr.db_section.tier_1_standby}
                      </Badge>
                    </div>
                    <div className="text-muted small mt-2">
                      環境變數：<code>PostgreSQL_USER/PASSWORD</code>
                    </div>
                    <div className="small text-light mt-2">{tr.db_section.tier_2_desc}</div>
                  </div>
                </Col>

                <Col md={4}>
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{
                      background:
                        isDbDown || dbMode === "mode_c"
                          ? "rgba(232, 168, 56, 0.15)"
                          : "rgba(255, 255, 255, 0.02)",
                      border:
                        isDbDown || dbMode === "mode_c"
                          ? "2px solid var(--color-accent)"
                          : "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-warning">{tr.db_section.tier_3_title}</span>
                      <Badge
                        bg={isDbDown || dbMode === "mode_c" ? "warning" : "secondary"}
                        text={isDbDown || dbMode === "mode_c" ? "dark" : "light"}
                      >
                        {isDbDown
                          ? tr.db_section.tier_3_failover
                          : dbMode === "mode_c"
                          ? tr.db_section.tier_3_active
                          : tr.db_section.tier_3_safeguard}
                      </Badge>
                    </div>
                    <div className="text-muted small mt-2">
                      檔案位置：<code>backend/db.sqlite3</code>
                    </div>
                    <div className="small text-light mt-2">
                      {isDbDown ? tr.db_section.tier_3_desc_down : tr.db_section.tier_3_desc_normal}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* 技術對比表格 */}
              <div className="mt-4 table-responsive">
                <table
                  className="table table-dark table-hover mb-0"
                  style={{ fontSize: "0.88rem" }}
                >
                  <thead>
                    <tr className="text-warning">
                      <th>{tr.db_section.table_metric}</th>
                      <th>PostgreSQL (Render / Docker)</th>
                      <th>SQLite (Fallback Safeguard)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-muted">{tr.db_section.table_concurrency}</td>
                      <td className="text-success">{tr.db_section.table_concurrency_pg}</td>
                      <td className="text-warning">{tr.db_section.table_concurrency_sqlite}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">{tr.db_section.table_overhead}</td>
                      <td>{tr.db_section.table_overhead_pg}</td>
                      <td className="text-success">{tr.db_section.table_overhead_sqlite}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">{tr.db_section.table_durability}</td>
                      <td className="text-success">{tr.db_section.table_durability_pg}</td>
                      <td className="text-danger">{tr.db_section.table_durability_sqlite}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* TAB 4: JWT 雙令牌無感刷新 */}
      {activeTab === "jwt" && (
        <div>
          <Card
            className="border-0 mb-4"
            style={{
              background: "var(--color-surface-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h3 className="h4 text-white fw-bold mb-1">{tr.jwt_section.title}</h3>
                  <p className="text-muted small mb-0">{tr.jwt_section.desc}</p>
                </div>
                <Badge bg="info" className="px-3 py-2">
                  Silent Refresh Flow
                </Badge>
              </div>

              {/* 互動按鈕 */}
              <div className="d-flex gap-2 mb-4">
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => setJwtStep((prev) => (prev + 1) % 5)}
                >
                  {tr.jwt_section.btn_next} (Step: {jwtStep + 1} / 5)
                </Button>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => setJwtStep(0)}
                >
                  {tr.jwt_section.btn_reset}
                </Button>
              </div>

              {/* 流程步驟卡片 */}
              <Row className="g-3">
                {tr.jwt_section.steps.map((item, index) => {
                  const isCurrent = jwtStep === index;
                  return (
                    <Col md={12} key={index}>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: isCurrent
                            ? "rgba(232, 168, 56, 0.12)"
                            : "rgba(255, 255, 255, 0.02)",
                          border: isCurrent
                            ? "2px solid var(--color-accent)"
                            : "1px solid rgba(255, 255, 255, 0.08)",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className={`fw-bold ${isCurrent ? "text-warning" : "text-light"}`}>
                            {item.title}
                          </span>
                          <Badge
                            bg={isCurrent ? "warning" : "secondary"}
                            text={isCurrent ? "dark" : "light"}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="text-muted small mt-1">{item.desc}</div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* TAB 5: 雙軌與雲端部屬架構 */}
      {activeTab === "docker" && (
        <div>
          <Card
            className="border-0 mb-4"
            style={{
              background: "var(--color-surface-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h3 className="h4 text-white fw-bold mb-1">{tr.docker_section.title}</h3>
                  <p className="text-muted small mb-0">{tr.docker_section.desc}</p>
                </div>
                <Badge bg="primary" className="px-3 py-2">
                  Cloud Native
                </Badge>
              </div>

              <Row className="g-3">
                <Col md={4}>
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <span className="badge bg-secondary mb-2">
                      {tr.docker_section.track_1_badge}
                    </span>
                    <h4 className="h6 text-warning mb-2">{tr.docker_section.track_1_title}</h4>
                    <ul className="text-light small list-unstyled d-flex flex-column gap-1 mb-0">
                      {tr.docker_section.track_1_points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </Col>

                <Col md={4}>
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <span className="badge bg-info text-dark mb-2">
                      {tr.docker_section.track_2_badge}
                    </span>
                    <h4 className="h6 text-warning mb-2">{tr.docker_section.track_2_title}</h4>
                    <ul className="text-light small list-unstyled d-flex flex-column gap-1 mb-0">
                      {tr.docker_section.track_2_points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </Col>

                <Col md={4}>
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <span className="badge bg-success mb-2">
                      {tr.docker_section.track_3_badge}
                    </span>
                    <h4 className="h6 text-warning mb-2">{tr.docker_section.track_3_title}</h4>
                    <ul className="text-light small list-unstyled d-flex flex-column gap-1 mb-0">
                      {tr.docker_section.track_3_points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default SystemDesign;
