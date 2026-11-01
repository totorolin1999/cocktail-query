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
  const itemsPerPage = 9;

  const [t] = useTranslation("global");

  const location = useLocation();
  const material = location.pathname.split("/")[2];

  let { user } = useContext(AuthContext);

  let api = useAxios();

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
                  <td>{item.chinese_name || item.Chinese_Name}</td>
                  <td>{item.english_name || item.English_Name}</td>
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
