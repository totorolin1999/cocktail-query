import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../apiConfig";
import CocktailArtwork, { isCocktailArtwork } from "./CocktailArtwork";
import IbaBadge from "./IbaBadge";

function CocktailCard({ data }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  const [, i18n] = useTranslation("global");

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

  return (
    <>
      <Row xs={1} sm={2} lg={3} className="g-4 justify-content-center">
        {currentItems.map((item, idx) => (
          <Col key={idx} className="d-flex justify-content-center">
            <Card
              as={Link}
              to={`/cocktails/${item.id}`}
              bg="dark"
              text="white"
              border="warning"
              className="text-center cocktailCard cocktail-card-link w-100"
              aria-label={
                i18n.language === "chinese"
                  ? (item.chinese_name || item.Chinese_Name)
                  : (item.english_name || item.English_Name)
              }
            >
              <Card.Header>
                {item.english_name || item.English_Name}
              </Card.Header>
              {isCocktailArtwork(item.image) ? (
                <CocktailArtwork cocktail={item} />
              ) : (
                <Card.Img
                  variant="top"
                  src={`${API_BASE_URL}${item.image}`}
                  className="cocktail-card-img"
                  alt={item.english_name || item.English_Name}
                />
              )}
              <Card.Body>
                <Card.Title className="cocktail-card-title">
                  {i18n.language === "chinese"
                    ? (item.chinese_name || item.Chinese_Name)
                    : (item.english_name || item.English_Name)}
                  <IbaBadge category={item.iba_category} />
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
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
}

export default CocktailCard;
