# 雞尾酒查詢系統前端 (Cocktail Query Frontend)

這是一個基於 React 框架構建的雞尾酒查詢與管理系統前端專案。本專案與後端 API 進行互動，提供雞尾酒搜尋、詳細資訊展示、原料（材料）管理、數據統計圖表以及管理員後台編輯等功能，並支援中英文雙語切換。

---

## 🚀 快速開始

> 💡 專案環境初始化與完整一鍵啟動步驟，請直接參閱 **[專案根目錄 Quick Start](../README.md#3-啟動前端-frontend)**。

### 環境變數配置 (`.env`)

在 `frontend` 目錄下提供有環境變數範本檔案 `.env.example`，請複製一份為 `.env`：

```bash
cp .env.example .env
```

此檔案用於配置後端 API 的連接位址，預設內容如下：
```env
REACT_APP_APP_URL=http://127.0.0.1:8000
# 部署至線上時的後端網址範例：
# REACT_APP_APP_URL=https://your-backend-app.onrender.com
```

---

## 🧪 測試專案

本專案使用 Jest 與 React Testing Library 進行單元測試。

### 執行互動式測試

執行以下命令以開啟互動式測試觀測模式 (Watch Mode)：

```bash
npm test
```

### 執行單次測試 (CI 模式)

如果您只需要在終端機中執行一次所有測試（例如在部署或 CI/CD 流程中），可以使用以下命令：

```bash
npm test -- --watchAll=false
```

---

## 📦 專案打包

當專案開發完成並準備部署至生產環境時，請執行以下命令進行打包：

```bash
npm run build
```

這將會在專案根目錄下生成一個 `build` 資料夾，其中包含經過壓縮、優化且已加上雜湊值 (Hash) 的靜態檔案，您可以直接將此資料夾部署至靜態網站託管服務（如 Netlify, Vercel, GitHub Pages 等）。

---

## 📂 專案目錄結構

```text
frontend/
├── .env.example         # 前端環境變數範本
├── package.json         # 專案依賴與腳本設定
├── public/              # 靜態資源 (HTML 樣本、圖示等)
└── src/
    ├── components/      # 共享與通用元件
    │   ├── AppNavbar.jsx    # 頂部導覽列（含語言切換、登入狀態）
    │   ├── CocktailCard.jsx # 雞尾酒卡片元件
    │   ├── CocktailDetail.jsx # 雞尾酒詳細資訊元件
    │   ├── MaterialTable.jsx # 原料表格元件
    │   ├── MaterialBarChart.jsx # 原料統計直條圖
    │   └── ...
    ├── context/         # 全域 Context 狀態管理
    │   └── AuthContext.js   # 登入與 Token 驗證狀態
    ├── pages/           # 頁面元件 (對應路由)
    │   ├── Home.jsx         # 首頁 (雞尾酒查詢)
    │   ├── LoginPage.jsx    # 管理員登入頁面
    │   ├── Cocktails.jsx    # 雞尾酒清單管理頁面 (需登入)
    │   ├── Material.jsx     # 原料詳細資訊頁面
    │   ├── Charts.jsx       # 統計圖表頁面
    │   └── ...
    ├── translations/    # 多語系語系檔
    │   ├── chinese/     # 中文翻譯 json
    │   └── english/     # 英文翻譯 json
    ├── utils/           # 工具函式與路由守衛
    │   ├── PrivateRoute.js  # 路由守衛 (限制未登入使用者存取特定頁面)
    │   ├── axiosInstance.js # Axios 攔截器設定 (自動帶入 JWT)
    │   └── cocktailPayloadUtils.js # 雞尾酒表單 payload 處理工具
    └── App.js           # 路由定義與主要應用進入點
```

---

## 🛠️ 主要技術棧

- **核心框架**：React 18.2.0 & React DOM
- **路由管理**：React Router DOM v6.11.1
- **樣式與 UI**：Bootstrap 5.2.3 & React Bootstrap 2.7.4 & Sass
- **圖表繪製**：Chart.js & React Chartjs 2
- **多語系支援**：i18next & React i18next (支援中文、英文)
- **API 請求**：Axios (配有自訂的 token 刷新與自動附加 Authorization 標頭邏輯)
