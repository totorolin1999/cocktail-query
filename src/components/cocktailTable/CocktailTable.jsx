import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useAxios from '../../utils/useAxios'
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ReactPaginate from "react-paginate";
import API_BASE_URL from '../../apiConfig';

const CocktailTable = ({ data }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  let api = useAxios()

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, data]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_BASE_URL}/api/cocktail-delete/` + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Table striped bordered hover className="mt-2">
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
              <td>{item.Chinese_Name}</td>
              <td>{item.English_Name}</td>
              <td>
                {item.Bases.map((base, index) => (
                  <span key={index}>{base.Chinese_Name}&nbsp;</span>
                ))}
              </td>
              <td>
                {item.Liqueurs.map((liqueur, index) => (
                  <span key={index}>{liqueur.Chinese_Name}&nbsp;</span>
                ))}
              </td>
              <td>
                {item.Alcohols.map((alcohol, index) => (
                  <span key={index}>{alcohol.Chinese_Name}&nbsp;</span>
                ))}
              </td>
              <td>
                {item.Ingredients.map((ingredient, index) => (
                  <span key={index}>{ingredient.Chinese_Name}&nbsp;</span>
                ))}
              </td>
              <td>
                <Button
                  variant="warning"
                  as={Link}
                  to={`/UpdateCocktail/${item.id}`}
                >
                  更新
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(item.id)}
                >
                  刪除
                </Button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="下一頁 >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< 上一頁"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />
    </>
  );
};

export default CocktailTable;
