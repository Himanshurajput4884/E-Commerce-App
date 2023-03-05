import React from "react";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

function IndividualCartProduct({ value, IncreaseQty, DecreaseQty }) {
  const handleIncreaseQty=()=>{
    IncreaseQty(value);
  }
  const handleDecreaseQty=()=>{
    DecreaseQty(value);
  }
  return (
    <Card style={{ width: "18rem", margin: "6px 2px" }}>
      <Card.Img
        variant="top"
        src={value.imageUrl}
        style={{ height: "20rem", width: "18rem" }}
      />
      <Card.Body>
        <Card.Title>{value.pname}</Card.Title>
        <Card.Text>
          <h5>₹ {value.price}</h5>
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Total Product Price:  {value.TotalProductPrice}</ListGroup.Item>
        <ListGroup.Item>Quantity: {value.qty}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Button variant="secondary" onClick={handleIncreaseQty}>
          +
        </Button>
        <span> Quantity </span>
        <Button variant="secondary" onClick={handleDecreaseQty}>
          -
        </Button>
      </Card.Body>
      <Card.Body>
        <Button variant="danger" >
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default IndividualCartProduct;
