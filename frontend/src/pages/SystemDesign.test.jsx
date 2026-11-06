import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import SystemDesign from "./SystemDesign";

const mockChangeLanguage = jest.fn();
let mockCurrentLang = "chinese";

jest.mock("react-i18next", () => ({
  useTranslation: () => [
    (key) => key,
    {
      language: mockCurrentLang,
      changeLanguage: (lang) => {
        mockCurrentLang = lang;
        mockChangeLanguage(lang);
      }
    }
  ]
}));

describe("SystemDesign Component", () => {
  beforeEach(() => {
    mockCurrentLang = "chinese";
    mockChangeLanguage.mockClear();
  });

  it("renders system design title, metrics, and navigation tabs", () => {
    render(
      <MemoryRouter>
        <SystemDesign />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cocktail Query — 系統設計與架構模擬器/i)).toBeInTheDocument();
    expect(screen.getByText(/Decoupled Full-Stack/i)).toBeInTheDocument();
    expect(screen.getAllByText(/全端拓撲與資料流/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/NLP 推薦演算法沙盒/i)).toBeInTheDocument();
    expect(screen.getByText(/三層資料庫回退機制/i)).toBeInTheDocument();
    expect(screen.getByText(/JWT 雙令牌無感刷新/i)).toBeInTheDocument();
    expect(screen.getByText(/雙軌與雲端部屬架構/i)).toBeInTheDocument();
  });

  it("switches to recommendation sandbox tab and calculates similarity", () => {
    render(
      <MemoryRouter>
        <SystemDesign />
      </MemoryRouter>
    );

    const recTab = screen.getByText(/NLP 推薦演算法沙盒/i);
    fireEvent.click(recTab);

    expect(screen.getByText(/調酒成份特徵向量化與餘弦相似度模擬器/i)).toBeInTheDocument();
    expect(screen.getByText(/計算所得相似度/i)).toBeInTheDocument();
  });

  it("switches to database fallback tab and simulates connection failure", () => {
    render(
      <MemoryRouter>
        <SystemDesign />
      </MemoryRouter>
    );

    const dbTab = screen.getByText(/三層資料庫回退機制/i);
    fireEvent.click(dbTab);

    expect(screen.getByText(/三層資料庫自動回退策略/i)).toBeInTheDocument();

    const triggerBtn = screen.getByText(/觸發模擬連線中斷/i);
    fireEvent.click(triggerBtn);

    expect(screen.getByText(/Failover Triggered/i)).toBeInTheDocument();
  });

  it("renders in English when global language is set to english via Navbar", () => {
    mockCurrentLang = "english";
    render(
      <MemoryRouter>
        <SystemDesign />
      </MemoryRouter>
    );

    expect(screen.getByText(/System Design & Interactive Sandbox/i)).toBeInTheDocument();
    expect(screen.getByText(/Architectural Pattern/i)).toBeInTheDocument();
  });
});
