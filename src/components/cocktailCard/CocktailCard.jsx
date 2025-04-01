import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./cocktailCard.scss";
import "../pagination/pagination.scss";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import API_BASE_URL from "../../apiConfig";

function CocktailCard({ data }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

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
    <>
      <Row xs={1} md={3} className="g-4 mt-4">
        {currentItems.map((item, idx) => (
          <Col key={idx}>
            <Card
              bg="dark"
              text="white"
              border="warning"
              className="text-center cocktailCard"
            >
              <Card.Header className="text-success">
                {item.English_Name}
              </Card.Header>
              <Card.Img
                variant="top"
                src={`${API_BASE_URL}${item.image}`}
                style={{ width: "260px", height: "340px", objectFit: "cover" }}
                className="mx-auto"
              />
              <Card.Body>
                <Card.Title className="text-warning">
                  <span className="hovertext" data-hover={item.English_Name}>
                    {item.Chinese_Name}
                  </span>
                </Card.Title>
                <Button variant="warning" as={Link} to={`/Cocktail/${item.id}`}>
                  GO!
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
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
}

export default CocktailCard;
