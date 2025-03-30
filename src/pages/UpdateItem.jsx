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
import API_BASE_URL from '../apiConfig';

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
    <div className="pt-4">
      <Container className="p-5 d-flex justify-content-center">
        <Card
          bg={"primary"}
          key={"primary"}
          text={"dark"}
          style={{ width: "25rem" }}
          className="mb-2"
        >
          <Card.Header>更新</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="m-3">
                <Form.Label>中文名稱</Form.Label>
                <Form.Control
                  placeholder="輸入中文名稱"
                  onChange={handleChange}
                  name="Chinese_Name"
                  value={item.Chinese_Name}
                />
              </Form.Group>

              <Form.Group className="m-3">
                <Form.Label>英文名稱</Form.Label>
                <Form.Control
                  placeholder="輸入英文名稱"
                  onChange={handleChange}
                  name="English_Name"
                  value={item.English_Name}
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

export default UpdateItem;
