import React, { useState } from "react";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { lightSelectProps } from "../utils/reactSelectConfig";
import QuickAddMaterialModal from "./QuickAddMaterialModal";

const CATEGORY_LABELS = {
  base: "基酒",
  liqueur: "利口酒",
  alcohol: "其他酒類",
  ingredient: "副材料",
};

const RecipeIngredientEditor = ({
  recipeItems,
  setRecipeItems,
  allMaterials,
  onMaterialCreated,
}) => {
  const [showModal, setShowModal] = useState(false);

  const options = (allMaterials || []).map((m) => {
    const id = m.id;
    const zh = m.chinese_name || m.Chinese_Name || "";
    const en = m.english_name || m.English_Name || "";
    const cat = CATEGORY_LABELS[m.category] || m.category;
    return {
      value: id,
      label: `${zh} (${en}) · [${cat}]`,
      name_zh: zh,
      name_en: en,
      category: m.category,
    };
  });

  const handleAdd = () => {
    setRecipeItems([
      ...recipeItems,
      { material_id: "", amount: "", name_zh: "", name_en: "", category: "ingredient" },
    ]);
  };

  const handleRemove = (index) => {
    setRecipeItems(recipeItems.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index, selectedOption) => {
    const next = [...recipeItems];
    next[index] = {
      ...next[index],
      material_id: selectedOption ? selectedOption.value : "",
      name_zh: selectedOption ? selectedOption.name_zh : "",
      name_en: selectedOption ? selectedOption.name_en : "",
      category: selectedOption ? selectedOption.category : "ingredient",
    };
    setRecipeItems(next);
  };

  const handleAmountChange = (index, amount) => {
    const next = [...recipeItems];
    next[index] = {
      ...next[index],
      amount,
    };
    setRecipeItems(next);
  };

  const handleQuickAddSuccess = (newMaterial) => {
    if (onMaterialCreated) {
      onMaterialCreated(newMaterial);
    }
    // 自動為剛建立的原料新增一筆配方項目
    setRecipeItems([
      ...recipeItems,
      {
        material_id: newMaterial.id,
        amount: "",
        name_zh: newMaterial.chinese_name,
        name_en: newMaterial.english_name,
        category: newMaterial.category,
      },
    ]);
  };

  return (
    <div className="recipe-ingredient-editor mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <Form.Label className="mb-0 fw-bold">酒譜配方與用量（材料 + 份量）</Form.Label>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowModal(true)}
            className="text-nowrap"
            title="若清單中缺少原料，可直接在此建立"
          >
            ＋ 快速建立新原料
          </Button>
          <Button
            variant="outline-warning"
            size="sm"
            onClick={handleAdd}
            className="text-nowrap"
            style={{ borderColor: "#e8a838", color: "#b87814" }}
          >
            ＋ 新增材料
          </Button>
        </div>
      </div>

      {(!recipeItems || recipeItems.length === 0) ? (
        <div className="text-center p-3 border rounded bg-light text-muted small">
          目前尚未加入任何材料，請點擊上方「＋ 新增材料」開始添加配方用量。
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {recipeItems.map((item, idx) => {
            const selectedOption =
              options.find((opt) => opt.value === Number(item.material_id)) || null;
            return (
              <Row key={idx} className="g-2 align-items-center">
                <Col xs={12} sm={7}>
                  <Select
                    options={options}
                    value={selectedOption}
                    onChange={(opt) => handleMaterialChange(idx, opt)}
                    placeholder="搜尋並選擇原料..."
                    isClearable
                    {...lightSelectProps}
                  />
                </Col>
                <Col xs={9} sm={4}>
                  <Form.Control
                    type="text"
                    placeholder="用量 (如: 45 ml, 2 dashes)"
                    value={item.amount || ""}
                    onChange={(e) => handleAmountChange(idx, e.target.value)}
                  />
                </Col>
                <Col xs={3} sm={1} className="text-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-100"
                    title="移除此項"
                    onClick={() => handleRemove(idx)}
                  >
                    ✕
                  </Button>
                </Col>
              </Row>
            );
          })}
        </div>
      )}

      <QuickAddMaterialModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreated={handleQuickAddSuccess}
      />
    </div>
  );
};

export default RecipeIngredientEditor;
