import React from "react";
import {BrowserRouter as Router,Routes,Route,} from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup"
import Login from "./components/Login"
import NotFound from "./components/NotFound"
import AddProducts from "./components/AddProducts";
import Cart from "./components/Cart";


function App() {
  return (
    <Router>
      
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addproduct" element={<AddProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<NotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;
