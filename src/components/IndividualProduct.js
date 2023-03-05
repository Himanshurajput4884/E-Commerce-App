import React from "react";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";


function IndividualProduct({value, addToCart}) {

  const handleAddCart=()=>{
    addToCart(value);
  }
  return (
    <Card style={{ width: "18rem", margin:"6px 2px"}}>
      <Card.Img variant="top" src={value.imageUrl} style={{ height: "20rem", width: "18rem" }}/>
      <Card.Body>
        <Card.Title>{value.pname}</Card.Title>
        <Card.Text>
         <h5>₹ {value.price}</h5>
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>{value.cname}</ListGroup.Item>
        <ListGroup.Item>Category: {value.category}</ListGroup.Item>
        <ListGroup.Item>{value.specs}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Button variant="primary" onClick={handleAddCart}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
}

export default IndividualProduct;
