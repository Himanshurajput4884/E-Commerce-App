import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast, ToastContainer } from "react-toastify";
import { db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";

function AddProducts() {
  const [formdata, setFormdata] = useState({
    pname: "",
    cname: "",
    category: "",
    specs: "",
    price: "",
    image: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormdata({ ...formdata, image: e.target.files[0] });
  };

  const handlePost = () => {
    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formdata.image.name}`
    );
    const uploadImage = uploadBytesResumable(storageRef, formdata.image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const productRef = collection(db, "products");
          addDoc(productRef, {
            pname: formdata.pname,
            cname: formdata.cname,
            category: formdata.category,
            price: formdata.price,
            specs: formdata.specs,
            imageUrl: url,
          })
            .then(() => {
              setFormdata({
                pname:"",
                cname:"",
                category:"",
                specs:"",
                price:"",
                image:"",
              });
              toast.success("Product Added");
            })
            .catch((err) => {
              toast.error("Error: ", err);
            });
        });
      }
    );
  };

  return (
    <div className="container bg-light border py-3 my-3">
      <Form>
        <h2>Add Product</h2>
        <ToastContainer />
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            name="pname"
            value={formdata.pname}
            required
            placeholder="Product Name"
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            required
            name="cname"
            value={formdata.cname}
            placeholder="Company Name"
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            size="sm"
            required
            value={formdata.category}
            aria-label="Default select example"
            name="category"
            onChange={(e) => handleChange(e)}
          >
            <option>Open this select menu</option>
            <option value="">Select Product Category</option>
            <option>Electronic Devices</option>
            <option>Mobile Accessories</option>
            <option>TV & Home Appliances</option>
            <option>Sports & outdoors</option>
            <option>Health & Beauty</option>
            <option>Home & Lifestyle</option>
            <option>Men's Fashion</option>
            <option>Watches, bags & Jewellery</option>
            <option>Groceries</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Specification</Form.Label>
          <Form.Control
            as="textarea"
            required
            rows={3}
            value={formdata.specs}
            name="specs"
            placeholder="Specification"
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            required
            value={formdata.price}
            placeholder="Price"
            name="price"
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            required
            name="image"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => {
            handlePost();
          }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default AddProducts;
