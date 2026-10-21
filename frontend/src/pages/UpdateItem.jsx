import useAxios from "../utils/useAxios";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

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

const UpdateItem = () => {
  const [item, setItem] = useState({
    id: null,
    Chinese_Name: "",
    English_Name: "",
  });

  let api = useAxios();

  const navigate = useNavigate();
  const location = useLocation();

  const material = location.pathname.split("/")[2];
  const itemId = location.pathname.split("/")[3];
  const materialLabel = materialTitles[material] || material;

  const handleChange = (e) => {
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/item-detail/${material}/${itemId}/`
        );
        setItem(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllItems();
  }, [material, itemId]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${API_BASE_URL}/api/item-update/${material}/${itemId}/`, item);
      navigate(`/Material/${material}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminFormLayout
      title={`更新${materialLabel}`}
      subtitle="修改中英文名稱"
      backTo={`/Material/${material}`}
      backLabel={`返回${materialLabel}列表`}
    >
      <Form onSubmit={handleClick}>
        <Form.Group className="mb-3">
          <Form.Label>中文名稱</Form.Label>
          <Form.Control
            placeholder="輸入中文名稱"
            onChange={handleChange}
            name="Chinese_Name"
            value={item.Chinese_Name}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>英文名稱</Form.Label>
          <Form.Control
            placeholder="輸入英文名稱"
            onChange={handleChange}
            name="English_Name"
            value={item.English_Name}
            required
          />
        </Form.Group>

        <div className="admin-form-actions">
          <Button variant="warning" type="submit" className="btn-accent">
            更新
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

export default UpdateItem;
