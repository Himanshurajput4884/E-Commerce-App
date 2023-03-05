import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { auth } from "../firebase";
import {toast, ToastContainer} from 'react-toastify'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formdata, setFormdata] = useState({
        email:"",
        password:"",
    })
    const navigate = useNavigate();
    const handleChange=(e)=>{
        setFormdata({...formdata, [e.target.name]:e.target.value});
    }

    const handlePost=()=>{
        console.log(formdata);
        signInWithEmailAndPassword(auth, formdata.email, formdata.password)
        .then(()=>{
            toast.success("Login Successfully");
            setFormdata({
                email:"",
                password:"",
            });
            setTimeout(()=>{
                navigate("/");
            },3000);
        })
        .catch((err)=>{
            console.log(err);
            toast.error(err.message);
        })
    }

  return (
    <div className="container bg-light border py-3 my-3">
    <Form>
      <h2>Login</h2>
      <ToastContainer/>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter Email" onChange={(e)=>handleChange(e)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password"  name="password" onChange={(e)=>handleChange(e)}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Don't have an Account? <a href="/signup">SignUp</a></Form.Label>
        </Form.Group>
      <Button variant="primary" onClick={()=>{handlePost()}}>
          Submit
        </Button>
    </Form>
  </div>
  )
}

export default Login
