import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

const Missing = () => {
  return (
    <Container className="page-section">
      <Card className="not-found-card">
        <Card.Header>找不到網頁</Card.Header>
        <Card.Body className="p-4">
          <Card.Title className="mb-3">本網站並沒有此頁面</Card.Title>
          <Card.Text className="text-muted mb-4">
            您是否要回到首頁？
          </Card.Text>
          <Button variant="warning" as={Link} to="/" className="btn-accent">
            回到首頁
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Missing;
