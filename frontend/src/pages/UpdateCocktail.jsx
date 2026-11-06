import useAxios from "../utils/useAxios";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import AdminFormLayout from "../components/AdminFormLayout";
import RecipeIngredientEditor from "../components/RecipeIngredientEditor";
import API_BASE_URL from "../apiConfig";

const IBA_OPTIONS = [
  { value: "", label: "非 IBA 官方分類 (None)" },
  { value: "The unforgettables", label: "難忘經典 (The Unforgettables)" },
  { value: "Contemporary Classics", label: "當代經典 (Contemporary Classics)" },
  { value: "New Era", label: "新時代調酒 (New Era)" },
];

const STRENGTH_OPTIONS = [
  { value: "", label: "未指定酒精等級" },
  { value: "low", label: "低濃度 (Low)" },
  { value: "medium", label: "中濃度 (Medium)" },
  { value: "high", label: "高濃度 (High)" },
];

const COLOR_OPTIONS = [
  { value: "amber", label: "琥珀金 (Amber)" },
  { value: "red", label: "深紅色 (Red)" },
  { value: "pink", label: "粉紅色 (Pink)" },
  { value: "blue", label: "湛藍色 (Blue)" },
  { value: "green", label: "翠綠色 (Green)" },
  { value: "cream", label: "乳白色 (Cream)" },
  { value: "clear", label: "透明無色 (Clear)" },
  { value: "purple", label: "神秘紫 (Purple)" },
  { value: "orange", label: "夕陽橙 (Orange)" },
  { value: "brown", label: "深褐色 (Brown)" },
];

const UpdateCocktail = () => {
  const { id: cocktailId } = useParams();

  const [allMaterials, setAllMaterials] = useState([]);
  const [recipeItems, setRecipeItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const [cocktail, setCocktail] = useState({
    chinese_name: "",
    english_name: "",
    iba_category: "",
    strength: "",
    glassware_zh: "",
    glassware_en: "",
    garnish_zh: "",
    garnish_en: "",
    instructions_zh: "",
    instructions_en: "",
    flavor_zh: "",
    flavor_en: "",
    history_zh: "",
    history_en: "",
    source_url: "",
    artwork_color: "amber",
    is_active: true,
  });

  const [submitError, setSubmitError] = useState("");
  const api = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterialsAndDetail = async () => {
      try {
        const [matRes, cocktailRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/materials/material/`),
          axios.get(`${API_BASE_URL}/api/v1/cocktails/${cocktailId}/`),
        ]);

        setAllMaterials(matRes.data);

        const data = cocktailRes.data;
        setCocktail({
          chinese_name: data.chinese_name || data.Chinese_Name || "",
          english_name: data.english_name || data.English_Name || "",
          iba_category: data.iba_category || "",
          strength: data.strength || "",
          glassware_zh: data.glassware_zh || "",
          glassware_en: data.glassware_en || "",
          garnish_zh: data.garnish_zh || "",
          garnish_en: data.garnish_en || "",
          instructions_zh: data.instructions_zh || "",
          instructions_en: data.instructions_en || "",
          flavor_zh: data.flavor_zh || "",
          flavor_en: data.flavor_en || "",
          history_zh: data.history_zh || "",
          history_en: data.history_en || "",
          source_url: data.source_url || "",
          artwork_color: data.artwork_color || "amber",
          is_active: data.is_active !== undefined ? data.is_active : true,
        });

        if (data.image) {
          setCurrentImageUrl(data.image);
        }

        if (Array.isArray(data.recipe_items)) {
          const items = data.recipe_items.map((item) => ({
            material_id: item.material ? item.material.id : item.material_id,
            amount: item.amount || "",
            category: item.material ? item.material.category : "ingredient",
            name_zh: item.material ? item.material.chinese_name : "",
            name_en: item.material ? item.material.english_name : "",
          }));
          setRecipeItems(items);
        }
      } catch (err) {
        console.error("載入調酒詳細資訊失敗：", err);
      }
    };

    fetchMaterialsAndDetail();
  }, [cocktailId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCocktail((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const formData = new FormData();

      Object.entries(cocktail).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });

      formData.append("Chinese_Name", cocktail.chinese_name);
      formData.append("English_Name", cocktail.english_name);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const validRecipeIngredients = recipeItems
        .filter((item) => item.material_id)
        .map((item, index) => ({
          material_id: Number(item.material_id),
          amount: item.amount || "",
          category: item.category || "ingredient",
          name_zh: item.name_zh || "",
          name_en: item.name_en || "",
          order: index,
        }));

      formData.append("recipe_ingredients", JSON.stringify(validRecipeIngredients));

      const filterCat = (cat) =>
        validRecipeIngredients
          .filter((item) => item.category === cat)
          .map((item) => ({ value: item.material_id }));

      formData.append("Bases", JSON.stringify(filterCat("base")));
      formData.append("Liqueurs", JSON.stringify(filterCat("liqueur")));
      formData.append("Alcohols", JSON.stringify(filterCat("alcohol")));
      formData.append("Ingredients", JSON.stringify(filterCat("ingredient")));

      const response = await api.post(
        `${API_BASE_URL}/api/v1/cocktails/${cocktailId}/`,
        formData
      );

      if (response?.status >= 200 && response?.status < 300) {
        navigate("/cocktails");
      } else {
        setSubmitError("更新調酒失敗，請稍後再試。");
      }
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "更新調酒失敗，請確認欄位是否填寫完整。";
      setSubmitError(detail);
    }
  };

  return (
    <AdminFormLayout
      title={`編輯調酒：${cocktail.chinese_name || cocktail.english_name || "載入中..."}`}
      subtitle="修改調酒基本資料、更新酒譜配方用量與風味設定"
      backTo="/cocktails"
      backLabel="返回管理儀表板"
      wide
    >
      <Form onSubmit={handleSubmit}>
        {submitError && (
          <Alert variant="danger" className="mb-3">
            {submitError}
          </Alert>
        )}

        {/* ── 基本資訊 ── */}
        <h5 className="mb-3 pb-2 border-bottom fw-bold text-primary">基本資訊</h5>
        <Row className="g-3 mb-3">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>中文名稱 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="chinese_name"
                value={cocktail.chinese_name}
                onChange={handleChange}
                placeholder="例如：琴通寧"
                required
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>英文名稱 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="english_name"
                value={cocktail.english_name}
                onChange={handleChange}
                placeholder="例如：Gin and Tonic"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>IBA 官方認證分類</Form.Label>
              <Form.Select
                name="iba_category"
                value={cocktail.iba_category}
                onChange={handleChange}
              >
                {IBA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>酒精濃度等級</Form.Label>
              <Form.Select
                name="strength"
                value={cocktail.strength}
                onChange={handleChange}
              >
                {STRENGTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* ── 酒譜配方用量 ── */}
        <RecipeIngredientEditor
          recipeItems={recipeItems}
          setRecipeItems={setRecipeItems}
          allMaterials={allMaterials}
          onMaterialCreated={(newMat) => setAllMaterials((prev) => [...prev, newMat])}
        />

        {/* ── 調製規格與呈現細節 ── */}
        <Accordion className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>進階調製細節、風味與歷史背景（點擊展開）</Accordion.Header>
            <Accordion.Body className="p-3">
              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>杯型 (中文)</Form.Label>
                    <Form.Control
                      name="glassware_zh"
                      value={cocktail.glassware_zh}
                      onChange={handleChange}
                      placeholder="例如：高球杯"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>杯型 (英文)</Form.Label>
                    <Form.Control
                      name="glassware_en"
                      value={cocktail.glassware_en}
                      onChange={handleChange}
                      placeholder="例如：Highball glass"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>裝飾物 (中文)</Form.Label>
                    <Form.Control
                      name="garnish_zh"
                      value={cocktail.garnish_zh}
                      onChange={handleChange}
                      placeholder="例如：青檸角"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>裝飾物 (英文)</Form.Label>
                    <Form.Control
                      name="garnish_en"
                      value={cocktail.garnish_en}
                      onChange={handleChange}
                      placeholder="例如：Lime wedge"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>調製方法與步驟 (中文)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="instructions_zh"
                      value={cocktail.instructions_zh}
                      onChange={handleChange}
                      placeholder="將琴酒注入裝滿冰塊的高球杯，補滿通寧水後輕柔攪拌。"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>調製步驟 (英文)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="instructions_en"
                      value={cocktail.instructions_en}
                      onChange={handleChange}
                      placeholder="Build all ingredients in a highball glass filled with ice. Stir gently."
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>風味特色 (中文)</Form.Label>
                    <Form.Control
                      name="flavor_zh"
                      value={cocktail.flavor_zh}
                      onChange={handleChange}
                      placeholder="例如：草本清爽、微苦氣泡感"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>風味描述 (英文)</Form.Label>
                    <Form.Control
                      name="flavor_en"
                      value={cocktail.flavor_en}
                      onChange={handleChange}
                      placeholder="例如：Refreshing, herbal, slightly bitter"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>圖案色系</Form.Label>
                    <Form.Select
                      name="artwork_color"
                      value={cocktail.artwork_color}
                      onChange={handleChange}
                    >
                      {COLOR_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>資料來源網址</Form.Label>
                    <Form.Control
                      type="url"
                      name="source_url"
                      value={cocktail.source_url}
                      onChange={handleChange}
                      placeholder="https://iba-world.com/..."
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>更新封面照片</Form.Label>
                {currentImageUrl && (
                  <div className="mb-2">
                    <img
                      src={currentImageUrl}
                      alt="目前封面"
                      style={{ maxHeight: "80px", borderRadius: "6px" }}
                    />
                    <small className="text-muted ms-2">（目前使用的封面）</small>
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  若不更換圖片請留空。
                </Form.Text>
              </Form.Group>

              <Form.Check
                type="switch"
                id="update_is_active_switch"
                name="is_active"
                label="正式啟用並上架此調酒（勾選後訪客可見）"
                checked={cocktail.is_active}
                onChange={handleChange}
                className="mt-3"
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <div className="admin-form-actions">
          <Button variant="warning" type="submit" className="btn-accent px-4">
            儲存變更
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/cocktails")}
          >
            取消
          </Button>
        </div>
      </Form>
    </AdminFormLayout>
  );
};

export default UpdateCocktail;
