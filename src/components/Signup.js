import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast, ToastContainer } from 'react-toastify'
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [ formdata, setFormdata ] = useState({
        name:"",
        email:"",
        password:"",
        cpassword:"",
    })
    const navigate = useNavigate();


    const handleChange = (e) =>{
        setFormdata({...formdata, [e.target.name]:e.target.value});
    }

    const handlePost=()=>{
        if(!formdata.name || !formdata.email || !formdata.password || !formdata.cpassword){
            alert("Please fill all the fields.");
            return;
        }
        if(formdata.password !== formdata.cpassword){
            alert("Password and Confirm Password are different.");
            return;
        }
              
        createUserWithEmailAndPassword(auth, formdata.email, formdata.password)
        .then((res)=>{
            console.log(res.user.uid);
            const docRef = doc(db, "users", res.user.uid);
            setDoc(docRef, {
                name:formdata.name,
                email:formdata.email,
                password:formdata.password
            })
            .then((result)=>{
                console.log("User register success");
                setFormdata({
                    name:"",
                    email:"",
                    password:"",
                })
                toast.success("Register Successfully");
                setTimeout(()=>{
                    navigate("/login");
                }, 3000);
            })
            .catch((error)=>{
                console.log(error);
            })
        })
        .catch((err)=>{
            toast.error("Something went wrong...");
            console.log(err);
        });

    }

  return (
    <div className="container bg-light border py-3 my-3">
      <Form>
        <h2>SignUp</h2>
        <ToastContainer/>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter Name" onChange={(e)=>handleChange(e)} />
          {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter Email" onChange={(e)=>handleChange(e)}/>
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" onChange={(e)=>handleChange(e)}/>
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm Password" name="cpassword" onChange={(e)=>handleChange(e)}/>
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Label>Have an Account? <a href="/login">Login</a></Form.Label>
        </Form.Group>
        <Button variant="primary" onClick={()=>{handlePost()}}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Signup;
