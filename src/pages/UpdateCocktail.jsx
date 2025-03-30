import useAxios from "../utils/useAxios";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
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

  console.log(cocktail);
  return (
    <div className="pt-4">
      <Container className="p-5 d-flex justify-content-center">
        <Card
          bg={"primary"}
          key={"primary"}
          text={"dark"}
          style={{ width: "25rem" }}
          className="mb-2"
        >
          <Card.Header>更新調酒</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="m-3">
                <Form.Label>中文名稱</Form.Label>
                <Form.Control
                  placeholder="輸入中文名稱"
                  onChange={handleChange}
                  name="Chinese_Name"
                  value={cocktail.Chinese_Name}
                />
              </Form.Group>

              <Form.Group className="m-3">
                <Form.Label>英文名稱</Form.Label>
                <Form.Control
                  placeholder="輸入英文名稱"
                  onChange={handleChange}
                  name="English_Name"
                  value={cocktail.English_Name}
                />
              </Form.Group>

              <Button variant="light" onClick={handleClick} className="m-3">
                更新
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UpdateCocktail;
