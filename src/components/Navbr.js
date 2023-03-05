import React from 'react'
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Icon from 'react-icons-kit';
import {shoppingCart} from 'react-icons-kit/feather/shoppingCart'
import Button from "react-bootstrap/Button";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Navbr(props) {
  const user = props.user;
  const navigate = useNavigate();
  const handleLogOut = ()=>{
    auth.signOut()
    .then(()=>{
      navigate("/login");
    })
  }

  

  return (
    <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Blog</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
        </Container>
        <Container style={{display:"flex" }}>
        <Nav className="me-auto">
            {!user && 
              <>
                <Nav.Link href="/signup">SignUp</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
              </>         
            }
            {user && <>
              <Nav.Link >{user}</Nav.Link>
              <Nav.Link href="/cart">
                <Icon icon={shoppingCart} size={20}/>
              </Nav.Link>
              <Button variant="danger" onClick={handleLogOut}>LogOut</Button>
            </>}
          </Nav>
        </Container>
      </Navbar>
  )
}

export default Navbr
