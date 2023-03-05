import React, {useState, useEffect} from 'react'
import { auth, db } from "../firebase";
import { collection, getDoc, doc, onSnapshot, setDoc, query } from 'firebase/firestore';
import Navbr from "./Navbr";
import AddProducts from "./AddProducts"
import Products from './Products';
import { useNavigate } from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify";

function Home() {
  const navigate = useNavigate();
  // getting current user uid
  const GetUserUid = () =>{
    const [uid, setUid] = useState(null);
    useEffect(()=>{
      auth.onAuthStateChanged((user)=>{
        if(user){
          setUid(user.uid);
        }
      })
    }, [])
    return uid;
  }

  const uid = GetUserUid();

  const CurrentUser = ()=>{
    const [ user, setUser ] = useState(null);
    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
        if(user){
          const userRef = doc(db, 'users', user.uid);
          getDoc(userRef).then((snapshot)=>{
            setUser(snapshot.data().name);
          })
        }
        else{
          setUser(null);
        }
      })
    }, []);
    return user;
  }  

  const user = CurrentUser();
  console.log(user);

  const [ products, setProducts ] = useState([]);

  
    useEffect(()=>{
      const prodRef = collection(db, "products");
      const q = query(prodRef);
      
      onSnapshot(q, (snapshot)=>{
        const prodd = snapshot.docs.map((doc)=>({
          id:doc.id,
          ...doc.data(),
        }));
        setProducts(prodd);
      })
    },[])  

    let Product;
    
    console.log(uid);
    const addToCart = (individualProduct)=>{
      if(uid !== null){
        Product=individualProduct;
        Product['qty'] = 1;
        Product['TotalProductPrice'] = Product.qty*Product.price;
        const CartRef = doc(db, 'Cart '+uid, Product.id);
        setDoc(CartRef, Product)
        .then(()=>{
          toast.success("Successfully Added to Cart");
        })
      }
      else{
        navigate("/login");
      }
    }


  return (
    <div>
      <Navbr user={user}/>
      <ToastContainer/>
      <>
        {products.length>0 && (
          <div className='container bg-light border py-3 my-3'>
            <h2>All Products</h2>
                <div className='container border '>
                  <Products products={products} addToCart={addToCart}/>
                </div>
          </div>
        )}
        {products.length<1 &&(
          <div className='container bg-light border '><h4>Please Wait...</h4></div>
        )}
      </>
    </div>
  )
}

export default Home
