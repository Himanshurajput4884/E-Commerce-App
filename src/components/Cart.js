import React, { useState, useEffect } from "react";
import {
  getDoc,
  doc,
  query,
  onSnapshot,
  collection,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbr from "./Navbr";
import CartProducts from "./CartProducts";
import { toast, ToastContainer } from "react-toastify";
import Card from "react-bootstrap/Card";
import StripeCheckout from "react-stripe-checkout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const navigate = useNavigate();
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
  });

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

  // getting total_price and total quantity
  const qty = cartProducts.map((v) => {
    return v.qty;
  });
  // console.log(qty);

  const Reducer = (accumulator, currValue) => accumulator + currValue;
  const totalQty = qty.reduce(Reducer, 0);

  const price = cartProducts.map((v) => {
    return v.TotalProductPrice;
  });
  const totalPrice = price.reduce(Reducer, 0);

  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const CartRef = collection(db, "Cart " + uid);
        const q = query(CartRef);
        onSnapshot(q, (snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  });

  const handleToken = async (token) => {
    // console.log(token);
    const cart = { name: "product", totalPrice };
    // now we send a response on backend server /checkout
    // to send response, we need axios
    // and in response we send token and cart.
    const response = await axios.post("http://localhost:8080/checkout", {
      token,
      cart,
    });

    let { status } = response.data;
    if (status === "success") {
      // navigate('/');
      toast.success("Your order is Placed successfully.");

      const uid = auth.currentUser.uid;
      const cartsRef = collection(db, "Cart " + uid);
      const docRef = await getDocs(cartsRef);
      docRef.forEach((docs) => {
        console.log(docs.data().id);
        const delRef = doc(db, "Cart " + uid, docs.data().id);
        deleteDoc(delRef)
          .then(() => {
            console.log("Entire Document has been deleted successfully.");
            navigate('/');
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      console.log("Something went wrong in checkout");
      alert("Something went wrong in checkout");
    }
  };

  return (
    <div>
      <Navbr user={user} totalProducts={totalProducts} />
      <br></br>
      <ToastContainer />
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
      <br></br>
      <div className="container">
        <Card className="text-center">
          <Card.Header>Summary</Card.Header>
          <Card.Body>
            <Card.Text>Total Price: ₹ {totalPrice}</Card.Text>
            <Card.Text>Total Number of Products: {totalQty}</Card.Text>
            <StripeCheckout
              stripeKey="pk_test_51MjcIhSAhRG1lvxh9Jfaurl56QpdRnDV9o85U8nB61ZayIYmIo7JNY4zx2TwU7VzONIVjO2UoVMLF3VFDQPjcLIB00fqRuc6Q7"
              token={handleToken}
              billingAddress
              shippingAddress
              name="product"
              amount={totalPrice * 100}
            ></StripeCheckout>
          </Card.Body>
        </Card>
      </div>
      <br></br>
    </div>
  );
}

export default Cart;
