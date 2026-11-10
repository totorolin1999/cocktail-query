import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import CocktailTable from "../components/CocktailTable";
import AdminMaterialTable from "../components/AdminMaterialTable";
import QuickAddMaterialModal from "../components/QuickAddMaterialModal";
import API_BASE_URL from "../apiConfig";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") === "materials" ? "materials" : "cocktails";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [cocktails, setCocktails] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const fetchAllCocktails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/cocktails/`);
      setCocktails(res.data);
    } catch (err) {
      console.error("載入調酒清單失敗", err);
    }
  };

  const fetchAllMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/materials/material/`);
      setMaterials(res.data);
    } catch (err) {
      console.error("載入材料清單失敗", err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchAllCocktails();
    fetchAllMaterials();
  }, []);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`/cocktails${tabKey === "materials" ? "?tab=materials" : ""}`, {
      replace: true,
    });
  };

  const handleMaterialCreated = (newMaterial) => {
    const zh = newMaterial.chinese_name || newMaterial.Chinese_Name;
    const en = newMaterial.english_name || newMaterial.English_Name;
    setSuccessToast(`✅ 已成功建立材料：${zh} (${en})！`);
    fetchAllMaterials();
    setActiveTab("materials");
    setTimeout(() => {
      setSuccessToast("");
    }, 4000);
  };

  return (
    <div className="chartPageColor page-section">
      <Container>
        <div className="page-header">
          <h1 className="page-title">管理後台儀表板</h1>
          <p className="page-subtitle">集中管理調酒資料、酒譜配方與材料庫存</p>
        </div>

        {successToast && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setSuccessToast("")}
            className="mb-3 py-2"
          >
            {successToast}
          </Alert>
        )}

        <Tabs
          activeKey={activeTab}
          onSelect={handleTabSelect}
          className="admin-dashboard-tabs mb-4"
        >
          {/* 調酒清單 Tab */}
          <Tab
            eventKey="cocktails"
            title={
              <span>
                🍸 調酒清單 <span className="tab-counter">({cocktails.length})</span>
              </span>
            }
          >
            <div className="page-actions mb-4 d-flex flex-wrap gap-2">
              <Button
                variant="warning"
                as={Link}
                to="/cocktails/new"
                className="btn-accent"
              >
                ＋ 新增調酒
              </Button>
              <Button
                variant="outline-warning"
                onClick={() => setShowMaterialModal(true)}
                style={{ borderColor: "#e8a838", color: "#f5d78e" }}
              >
                ＋ 新增材料
              </Button>
            </div>

            <CocktailTable data={cocktails} />
          </Tab>

          {/* 材料庫管理 Tab */}
          <Tab
            eventKey="materials"
            title={
              <span>
                🍋 材料庫管理{" "}
                <span className="tab-counter">({materials.length})</span>
              </span>
            }
          >
            {loadingMaterials ? (
              <div className="text-center py-5 text-muted">載入材料庫中...</div>
            ) : (
              <AdminMaterialTable
                materials={materials}
                onReload={fetchAllMaterials}
                onOpenAddModal={() => setShowMaterialModal(true)}
              />
            )}
          </Tab>
        </Tabs>

        <QuickAddMaterialModal
          show={showMaterialModal}
          onHide={() => setShowMaterialModal(false)}
          onCreated={handleMaterialCreated}
        />
      </Container>
    </div>
  );
};

export default Dashboard;
