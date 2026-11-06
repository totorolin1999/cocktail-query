import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useAxios from '../utils/useAxios'
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ReactPaginate from "react-paginate";
import API_BASE_URL from '../apiConfig';
import IbaBadge from "./IbaBadge";

const CocktailTable = ({ data }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  let api = useAxios()

  useEffect(() => {
    if (!data.length) {
      setCurrentItems([]);
      setItemOffset(0);
      setPageCount(0);
      return;
    }

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const maxOffset = Math.max(0, (totalPages - 1) * itemsPerPage);

    if (itemOffset > maxOffset) {
      setItemOffset(maxOffset);
      return;
    }

    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(totalPages);
  }, [itemOffset, itemsPerPage, data]);

  const handlePageClick = (event) => {
    const totalPages = data.length === 0 ? 0 : Math.ceil(data.length / itemsPerPage);
    const selectedPage = Math.min(Math.max(event.selected, 0), Math.max(totalPages - 1, 0));
    setItemOffset(selectedPage * itemsPerPage);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_BASE_URL}/api/v1/cocktails/${id}/`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const getCategoryMaterials = (item, category) => {
    if (Array.isArray(item.recipe_items) && item.recipe_items.length > 0) {
      return item.recipe_items
        .filter((r) => r.material && r.material.category === category)
        .map((r) => r.material);
    }
    const plural =
      category === "base"
        ? "bases"
        : category === "liqueur"
        ? "liqueurs"
        : category === "alcohol"
        ? "alcohols"
        : "ingredients";
    const capitalPlural = plural.charAt(0).toUpperCase() + plural.slice(1);
    return item[plural] || item[capitalPlural] || [];
  };

  return (
    <>
      <div className="table-panel">
        <div className="table-responsive-wrapper">
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>中文名稱</th>
                <th>英文名稱</th>
                <th>基酒</th>
                <th>利口酒</th>
                <th>其他酒類</th>
                <th>其他成分</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.chinese_name || item.Chinese_Name}</td>
                  <td>
                    {item.english_name || item.English_Name}
                    <IbaBadge category={item.iba_category} />
                  </td>
                  <td>
                    {getCategoryMaterials(item, "base").map((base, index) => (
                      <span key={index}>{base.chinese_name || base.Chinese_Name}&nbsp;</span>
                    ))}
                  </td>
                  <td>
                    {getCategoryMaterials(item, "liqueur").map((liqueur, index) => (
                      <span key={index}>{liqueur.chinese_name || liqueur.Chinese_Name}&nbsp;</span>
                    ))}
                  </td>
                  <td>
                    {getCategoryMaterials(item, "alcohol").map((alcohol, index) => (
                      <span key={index}>{alcohol.chinese_name || alcohol.Chinese_Name}&nbsp;</span>
                    ))}
                  </td>
                  <td>
                    {getCategoryMaterials(item, "ingredient").map((ingredient, index) => (
                      <span key={index}>{ingredient.chinese_name || ingredient.Chinese_Name}&nbsp;</span>
                    ))}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="warning"
                        size="sm"
                        as={Link}
                        to={`/cocktails/${item.id}/edit`}
                        className="btn-accent"
                      >
                        更新
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        刪除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="active"
        />
      )}
    </>
  );
};

export default CocktailTable;
