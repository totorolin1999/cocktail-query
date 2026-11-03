import useAxios from "../utils/useAxios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import AdminFormLayout from "../components/AdminFormLayout";
import Missing from "../components/Missing";
import API_BASE_URL from "../apiConfig";
import { isValidMaterial, getMaterialTitle } from "../utils/materialUtils";

const CATEGORY_OPTIONS = [
  { value: "base", labelZh: "基酒", labelEn: "Base" },
  { value: "liqueur", labelZh: "利口酒", labelEn: "Liqueur" },
  { value: "alcohol", labelZh: "其他酒類", labelEn: "Alcohol" },
  { value: "ingredient", labelZh: "副材料", labelEn: "Ingredient" },
];

const AddItem = () => {
  const { material } = useParams();

  const [item, setItem] = useState({
    chinese_name: "",
    english_name: "",
    category: material || "base",
  });
  const [submitError, setSubmitError] = useState("");

  const api = useAxios();
  const navigate = useNavigate();

  if (!isValidMaterial(material)) {
    return <Missing />;
  }

  const materialLabel = getMaterialTitle(material, "zh");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "chinese_name" ? { Chinese_Name: value } : {}),
      ...(name === "english_name" ? { English_Name: value } : {}),
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const targetCategory = item.category || material;
    try {
      await api.post(`${API_BASE_URL}/api/item-create/${targetCategory}/`, {
        ...item,
        category: targetCategory,
      });
      navigate(`/Dashboard?tab=materials`);
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "新增失敗，請確認欄位是否填寫正確。";
      setSubmitError(detail);
    }
  };

  return (
    <AdminFormLayout
      title={`新增${materialLabel}`}
      subtitle="請填寫原料名稱與分類"
      backTo="/Dashboard?tab=materials"
      backLabel="返回材料庫管理"
    >
      <Form onSubmit={handleClick}>
        {submitError && (
          <Alert variant="danger" className="mb-3">
            {submitError}
          </Alert>
        )}

        <Form.Group className="mb-3">
          <Form.Label>材料分類</Form.Label>
          <Form.Select
            name="category"
            value={item.category}
            onChange={handleChange}
            required
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.labelZh} ({opt.labelEn})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>中文名稱</Form.Label>
          <Form.Control
            placeholder="例如：琴酒、君度橙酒、檸檬汁"
            onChange={handleChange}
            name="chinese_name"
            value={item.chinese_name}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>英文名稱</Form.Label>
          <Form.Control
            placeholder="例如：Gin、Cointreau、Lemon Juice"
            onChange={handleChange}
            name="english_name"
            value={item.english_name}
            required
          />
        </Form.Group>

        <div className="admin-form-actions">
          <Button variant="warning" type="submit" className="btn-accent">
            新增
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate(`/Material/${material}`)}
          >
            取消
          </Button>
        </div>
      </Form>
    </AdminFormLayout>
  );
};

export default AddItem;
