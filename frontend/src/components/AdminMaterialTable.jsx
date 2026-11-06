import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ReactPaginate from "react-paginate";
import useAxios from "../utils/useAxios";
import API_BASE_URL from "../apiConfig";

const CATEGORY_MAP = {
  base: { label: "基酒", badgeClass: "badge-cat-base" },
  liqueur: { label: "利口酒", badgeClass: "badge-cat-liqueur" },
  alcohol: { label: "其他酒類", badgeClass: "badge-cat-alcohol" },
  ingredient: { label: "其他成分", badgeClass: "badge-cat-ingredient" },
};

const AdminMaterialTable = ({ materials = [], onReload, onOpenAddModal }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  const api = useAxios();

  const categoryCounts = useMemo(() => {
    const counts = { all: materials.length, base: 0, liqueur: 0, alcohol: 0, ingredient: 0 };
    materials.forEach((m) => {
      const cat = m.category || "ingredient";
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      }
    });
    return counts;
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const cat = item.category || "ingredient";
      const matchCat = selectedCategory === "all" || cat === selectedCategory;

      const zh = (item.chinese_name || item.Chinese_Name || "").toLowerCase();
      const en = (item.english_name || item.English_Name || "").toLowerCase();
      const query = searchTerm.trim().toLowerCase();
      const matchSearch = !query || zh.includes(query) || en.includes(query);

      return matchCat && matchSearch;
    });
  }, [materials, selectedCategory, searchTerm]);

  // 分頁計算
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const offset = Math.min(itemOffset, Math.max(0, (totalPages - 1) * itemsPerPage));
    return filteredMaterials.slice(offset, offset + itemsPerPage);
  }, [filteredMaterials, itemOffset, totalPages]);

  const handlePageClick = (event) => {
    setItemOffset(event.selected * itemsPerPage);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setItemOffset(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setItemOffset(0);
  };

  const handleDelete = async (item) => {
    const name = item.chinese_name || item.Chinese_Name || "此材料";
    const ok = window.confirm(`確定要刪除材料「${name}」嗎？若已有調酒使用此材料，建議先確認酒譜。`);
    if (!ok) return;

    try {
      const cat = item.category || "material";
      await api.delete(`${API_BASE_URL}/api/item-delete/${cat}/${item.id}`);
      if (onReload) onReload();
    } catch (err) {
      console.error("刪除材料失敗", err);
      alert("刪除失敗，請檢查權限或連線。");
    }
  };

  return (
    <div className="admin-material-manager">
      {/* 頂部操作工具列 */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div className="d-flex flex-wrap gap-2 category-pills-bar">
          <Button
            variant={selectedCategory === "all" ? "warning" : "outline-secondary"}
            size="sm"
            onClick={() => handleCategorySelect("all")}
            className="rounded-pill px-3"
          >
            全部 ({categoryCounts.all})
          </Button>
          <Button
            variant={selectedCategory === "base" ? "warning" : "outline-secondary"}
            size="sm"
            onClick={() => handleCategorySelect("base")}
            className="rounded-pill px-3"
          >
            基酒 ({categoryCounts.base})
          </Button>
          <Button
            variant={selectedCategory === "liqueur" ? "warning" : "outline-secondary"}
            size="sm"
            onClick={() => handleCategorySelect("liqueur")}
            className="rounded-pill px-3"
          >
            利口酒 ({categoryCounts.liqueur})
          </Button>
          <Button
            variant={selectedCategory === "alcohol" ? "warning" : "outline-secondary"}
            size="sm"
            onClick={() => handleCategorySelect("alcohol")}
            className="rounded-pill px-3"
          >
            其他酒類 ({categoryCounts.alcohol})
          </Button>
          <Button
            variant={selectedCategory === "ingredient" ? "warning" : "outline-secondary"}
            size="sm"
            onClick={() => handleCategorySelect("ingredient")}
            className="rounded-pill px-3"
          >
            副材料 ({categoryCounts.ingredient})
          </Button>
        </div>

        <div className="d-flex align-items-center gap-2 ms-auto" style={{ minWidth: "260px" }}>
          <InputGroup size="sm">
            <Form.Control
              placeholder="搜尋材料名稱 (中 / 英文)..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-dark text-white border-secondary"
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setItemOffset(0);
                }}
              >
                ✕
              </Button>
            )}
          </InputGroup>
          {onOpenAddModal && (
            <Button
              variant="warning"
              size="sm"
              onClick={onOpenAddModal}
              className="btn-accent text-nowrap"
            >
              ＋ 新增材料
            </Button>
          )}
        </div>
      </div>

      {/* 資料表格 */}
      <div className="table-panel">
        <div className="table-responsive-wrapper">
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th style={{ width: "120px" }}>分類</th>
                <th>中文名稱</th>
                <th>英文名稱</th>
                <th style={{ width: "150px" }}>編輯操作</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    {searchTerm ? "找不到符合搜尋條件的材料" : "目前尚無任何材料資料"}
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const catInfo = CATEGORY_MAP[item.category] || {
                    label: item.category || "其他",
                    badgeClass: "badge-cat-ingredient",
                  };
                  return (
                    <tr key={item.id}>
                      <td>
                        <span className={`cat-pill ${catInfo.badgeClass}`}>
                          {catInfo.label}
                        </span>
                      </td>
                      <td className="fw-bold">{item.chinese_name || item.Chinese_Name}</td>
                      <td>{item.english_name || item.English_Name}</td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="warning"
                            size="sm"
                            as={Link}
                            to={`/UpdateItem/${item.category || "material"}/${item.id}`}
                            className="btn-accent"
                          >
                            更新
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(item)}
                          >
                            刪除
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* 分頁器 */}
      {totalPages > 1 && (
        <div className="mt-3">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={totalPages}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="active"
          />
        </div>
      )}
    </div>
  );
};

export default AdminMaterialTable;
