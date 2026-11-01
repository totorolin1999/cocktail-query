import useAxios from "../utils/useAxios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AdminFormLayout from "../components/AdminFormLayout";
import API_BASE_URL from '../apiConfig';

const materialTitles = {
  base: "基酒",
  liqueur: "利口酒",
  alcohol: "其他酒類",
  ingredient: "其他成分",
};

const AddItem = () => {
  const [item, setItem] = useState({
    chinese_name: "",
    english_name: "",
    Chinese_Name: "",
    English_Name: "",
  });

  let api = useAxios();

  const navigate = useNavigate();
  const location = useLocation();

  const material = location.pathname.split("/")[2];
  const materialLabel = materialTitles[material] || material;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "Chinese_Name" || name === "chinese_name"
        ? { chinese_name: value, Chinese_Name: value }
        : {}),
      ...(name === "English_Name" || name === "english_name"
        ? { english_name: value, English_Name: value }
        : {}),
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${API_BASE_URL}/api/item-create/${material}/`, item);
      navigate(`/Material/${material}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminFormLayout
      title={`新增${materialLabel}`}
      subtitle="請填寫中英文名稱"
      backTo={`/Material/${material}`}
      backLabel={`返回${materialLabel}列表`}
    >
      <Form onSubmit={handleClick}>
        <Form.Group className="mb-3">
          <Form.Label>中文名稱</Form.Label>
          <Form.Control
            placeholder="輸入中文名稱"
            onChange={handleChange}
            name="chinese_name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>英文名稱</Form.Label>
          <Form.Control
            placeholder="輸入英文名稱"
            onChange={handleChange}
            name="english_name"
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
