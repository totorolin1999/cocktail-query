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
import "./layout/layout.scss";
import API_BASE_URL from '../apiConfig';

const UpdateAlcohol = () => {
  const [alcohol, setAlcohol] = useState({
    Alcohol_ID: null,
    Chinese_Name: "",
    English_Name: "",
  });

  let api = useAxios();

  const navigate = useNavigate();
  const location = useLocation();

  const alcoholId = location.pathname.split("/")[2];

  const handleChange = (e) => {
    setAlcohol((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const fetchAllAlcohols = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/alcohol-detail/${alcoholId}/`
        );
        setAlcohol(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllAlcohols();
  }, [alcoholId]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        `${API_BASE_URL}/api/alcohol-update/${alcoholId}/`,
        alcohol
      );
      navigate("/Alcohols");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(alcohol);
  return (
    <div className="backgroundColor pt-4">
      <Container className="p-5 d-flex justify-content-center">
        <Card
          bg={"primary"}
          key={"primary"}
          text={"dark"}
          style={{ width: "25rem" }}
          className="mb-2"
        >
          <Card.Header>更新其他酒類</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="m-3">
                <Form.Label>中文名稱</Form.Label>
                <Form.Control
                  placeholder="輸入中文名稱"
                  onChange={handleChange}
                  name="Chinese_Name"
                  value={alcohol.Chinese_Name}
                />
              </Form.Group>

              <Form.Group className="m-3">
                <Form.Label>英文名稱</Form.Label>
                <Form.Control
                  placeholder="輸入英文名稱"
                  onChange={handleChange}
                  name="English_Name"
                  value={alcohol.English_Name}
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

export default UpdateAlcohol;
