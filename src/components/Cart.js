import React, { useState, useEffect } from "react";
import {
  getDoc,
  doc,
  query,
  onSnapshot,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbr from "./Navbr";
import CartProducts from "./CartProducts";
import { toast, ToastContainer } from "react-toastify";

function Cart() {
  const GetUserUid = () => {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);
    return uid;
  };

  const uid = GetUserUid();

  const CurrentUser = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          getDoc(userRef).then((snapshot) => {
            setUser(snapshot.data().name);
          });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  };

  const user = CurrentUser();
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const prodRef = collection(db, "Cart " + uid);
        const q = query(prodRef);

        onSnapshot(q, (snapshot) => {
          const prodd = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartProducts(prodd);
        });
      } else {
        console.log("User is not signed up.");
      }
    });
  }, []);

  console.log(cartProducts);

  let Product;

  const IncreaseQty = (product) => {
    Product = product;
    Product.qty = product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;

    auth.onAuthStateChanged((user) => {
      if (user) {
        const CartRef = doc(db, "Cart " + uid, product.id);
        updateDoc(CartRef, Product).then(() => {
          toast.success("Increament Added");
        });
      } else {
        console.log("user is not logged in.");
      }
    });
  };

  const DecreaseQty = (product) => {
    Product = product;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;

      auth.onAuthStateChanged((user) => {
        if (user) {
          const CartRef = doc(db, "Cart " + uid, product.id);
          updateDoc(CartRef, Product).then(() => {
            toast.success("Increament Added");
          });
        } else {
          console.log("user is not logged in.");
        }
      });
    }
  };

  return (
    <div>
      <Navbr user={user} />
      <br></br>
      {cartProducts.length > 0 && (
        <div className="container bg-light border">
          <h2>Cart Products</h2>
          <CartProducts
            cartProducts={cartProducts}
            IncreaseQty={IncreaseQty}
            DecreaseQty={DecreaseQty}
          />
        </div>
      )}
      {cartProducts < 1 && (
        <div className="container-fluid">No Products to show.</div>
      )}
    </div>
  );
}

export default Cart;
