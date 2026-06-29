import React, { useContext } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import useAxios from "../utils/useAxios";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";
import AuthContext from "../context/AuthContext";
import API_BASE_URL from "../apiConfig";

const MaterialTable = ({ data }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  const [t] = useTranslation("global");

  const location = useLocation();
  const material = location.pathname.split("/")[2];

  let { user } = useContext(AuthContext);

  let api = useAxios();

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, data]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_BASE_URL}/api/item-delete/${material}/` + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="materialTable">
      <div className="table-panel">
        <div className="table-responsive-wrapper">
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>{t("table.chinese")}</th>
                <th>{t("table.english")}</th>
                {user && <th>編輯</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.Chinese_Name}</td>
                  <td>{item.English_Name}</td>
                  {user && (
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="warning"
                          size="sm"
                          as={Link}
                          to={`/UpdateItem/${material}/${item.id}`}
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
                  )}
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
    </div>
  );
};

export default MaterialTable;
