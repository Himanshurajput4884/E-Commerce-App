import React from "react";
import IndividualProduct from "./IndividualProduct";

function Products({products, addToCart}) {
  
  return products.map((product)=>(
            <IndividualProduct key={product.id} value={product} addToCart={addToCart}/>
        ));
  
}

export default Products;
