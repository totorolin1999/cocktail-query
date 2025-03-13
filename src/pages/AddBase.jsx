import useAxios from "../utils/useAxios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./layout/layout.scss";
import API_BASE_URL from '../apiConfig';

const AddBase = () => {
  const [base, setBase] = useState({
    Chinese_Name: "",
    English_Name: "",
  });

  let api = useAxios();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBase((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${API_BASE_URL}/api/base-create/`, base);
      navigate("/Bases");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(base);
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
          <Card.Header>新增基酒</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="m-3">
                <Form.Label>中文名稱</Form.Label>
                <Form.Control
                  placeholder="輸入中文名稱"
                  onChange={handleChange}
                  name="Chinese_Name"
                />
              </Form.Group>

              <Form.Group className="m-3">
                <Form.Label>英文名稱</Form.Label>
                <Form.Control
                  placeholder="輸入英文名稱"
                  onChange={handleChange}
                  name="English_Name"
                />
              </Form.Group>

              <Button variant="light" onClick={handleClick} className="m-3">
                新增
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AddBase;
