import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import useAxios from "../utils/useAxios";
import API_BASE_URL from "../apiConfig";

const CATEGORY_OPTIONS = [
  { value: "base", labelZh: "基酒", labelEn: "Base" },
  { value: "liqueur", labelZh: "利口酒", labelEn: "Liqueur" },
  { value: "alcohol", labelZh: "其他酒類", labelEn: "Alcohol" },
  { value: "ingredient", labelZh: "副材料", labelEn: "Ingredient" },
];

const QuickAddMaterialModal = ({
  show,
  onHide,
  onCreated,
  defaultCategory = "base",
}) => {
  const [formData, setFormData] = useState({
    chinese_name: "",
    english_name: "",
    category: defaultCategory,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const api = useAxios();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "chinese_name" ? { Chinese_Name: value } : {}),
      ...(name === "english_name" ? { English_Name: value } : {}),
    }));
  };

  const handleClose = () => {
    setErrorMsg("");
    setFormData({
      chinese_name: "",
      english_name: "",
      category: defaultCategory,
    });
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const targetCategory = formData.category || "base";
      const payload = {
        chinese_name: formData.chinese_name.trim(),
        english_name: formData.english_name.trim(),
        category: targetCategory,
      };

      const res = await api.post(
        `${API_BASE_URL}/api/v1/materials/${targetCategory}/`,
        payload
      );

      const createdItem = res.data;
      if (onCreated) {
        onCreated(createdItem);
      }
      handleClose();
    } catch (err) {
      console.error("快速新增原料失敗：", err);
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "建立原料失敗，請確認欄位是否填寫正確。";
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      className="admin-dark-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-bold">快速建立新材料</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          {errorMsg && (
            <Alert variant="danger" className="mb-3 py-2 small">
              {errorMsg}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">材料分類</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
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
            <Form.Label className="fw-semibold">
              中文名稱 <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="chinese_name"
              placeholder="例如：紫蘇利口酒、接骨木花糖漿"
              value={formData.chinese_name}
              onChange={handleChange}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold">
              英文名稱 <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="english_name"
              placeholder="例如：Shiso Liqueur、Elderflower Syrup"
              value={formData.english_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            variant="warning"
            type="submit"
            className="btn-accent px-4"
            disabled={loading}
          >
            {loading ? "建立中..." : "建立並加入"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default QuickAddMaterialModal;
