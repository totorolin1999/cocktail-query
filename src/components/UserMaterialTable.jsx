import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import "./components.scss";
import { useTranslation } from "react-i18next";

const UserMaterialTable = ({ data }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  const [t, i18n] = useTranslation("global");

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

  return (
    <div className="materialTable">
      <Table striped bordered hover className="mt-2">
        <thead>
          <tr>
            <th>{t("table.chinese")}</th>
            <th>{t("table.english")}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.Chinese_Name}</td>
              <td>{item.English_Name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
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
    </div>
  );
};

export default UserMaterialTable;
