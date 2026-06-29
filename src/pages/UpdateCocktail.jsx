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
import API_BASE_URL from "../apiConfig";

const UpdateCocktail = () => {
  const [cocktail, setCocktail] = useState({
    id: null,
    Chinese_Name: "",
    English_Name: "",
  });

  let api = useAxios();

  const navigate = useNavigate();
  const location = useLocation();

  const cocktailId = location.pathname.split("/")[2];

  const handleChange = (e) => {
    setCocktail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const fetchAllCocktails = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/cocktail-detail/${cocktailId}/`
        );
        setCocktail(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCocktails();
  }, [cocktailId]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        `${API_BASE_URL}/api/cocktail-update/${cocktailId}/`,
        cocktail
      );
      navigate("/Cocktails");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminFormLayout
      title="更新調酒"
      subtitle="修改調酒的中英文名稱"
      backTo="/Cocktails"
      backLabel="返回調酒列表"
    >
      <Form onSubmit={handleClick}>
        <Form.Group className="mb-3">
          <Form.Label>中文名稱</Form.Label>
          <Form.Control
            placeholder="輸入中文名稱"
            onChange={handleChange}
            name="Chinese_Name"
            value={cocktail.Chinese_Name}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>英文名稱</Form.Label>
          <Form.Control
            placeholder="輸入英文名稱"
            onChange={handleChange}
            name="English_Name"
            value={cocktail.English_Name}
            required
          />
        </Form.Group>

        <div className="admin-form-actions">
          <Button variant="warning" type="submit" className="btn-accent">
            更新
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/Cocktails")}
          >
            取消
          </Button>
        </div>
      </Form>
    </AdminFormLayout>
  );
};

export default UpdateCocktail;
