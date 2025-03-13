import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useAxios from '../../utils/useAxios'
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ReactPaginate from "react-paginate";
import "./liqueurTable.scss";
import API_BASE_URL from '../../apiConfig';

const LiqueurTable = ({ data }) => {
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
      await api.delete(`${API_BASE_URL}/api/liqueur-delete/` + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="liqueurTable">
      <Table striped bordered hover className="mt-2">
        <thead>
          <tr>
            <th>中文名稱</th>
            <th>英文名稱</th>
            <th>編輯</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((liqueur) => (
            <tr key={liqueur.Liqueur_ID}>
              <td>{liqueur.Chinese_Name}</td>
              <td>{liqueur.English_Name}</td>
              <td>
                <Button
                  variant="warning"
                  as={Link}
                  to={`/UpdateLiqueur/${liqueur.Liqueur_ID}`}
                >
                  更新
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(liqueur.Liqueur_ID)}
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
    </div>
  );
};

export default LiqueurTable;
