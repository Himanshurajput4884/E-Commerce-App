import React from "react";
import IndividualCartProduct from "./IndividualCartProduct";

function CartProducts({cartProducts, IncreaseQty, DecreaseQty}) {
  
  return cartProducts.map((product)=>(
            <IndividualCartProduct key={product.id} value={product} IncreaseQty={IncreaseQty} DecreaseQty={DecreaseQty} />
        ));
  
}

export default CartProducts;
