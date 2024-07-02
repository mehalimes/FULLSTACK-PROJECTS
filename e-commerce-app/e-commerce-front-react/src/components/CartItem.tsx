import { useState, useMemo } from "react";
import "./../styles/CartItem.css";
import DecreaseButton from "./DecreaseButton";
import IncreaseButton from "./IncreaseButton";

interface CartItemProps {
  src: string;
  name: string;
  price: number;
  quantity: number;
  productId: number;
  userId: number;
}

export default function CartItem(props: CartItemProps) {
  const { src, name, price, quantity, productId, userId } = props;

  const subTotal = useMemo(() => {
    return price * quantity;
  }, [price, quantity]);

  return (
    <div className="cart-item-con">
      <div className="cart-item-image-con">
        <img src={src} className="cart-item-image" alt="cart item image" />
      </div>
      <div className="cart-item-name-con">{name}</div>
      <div className="cart-item-price-con">{price + " TL/adet"}</div>
      <div className="cart-item-sub-total-con">{subTotal + " TL"}</div>
      <div className="cart-item-quantity-con">
        <DecreaseButton productId={productId} userId={userId} />
        {quantity}
        <IncreaseButton productId={productId} userId={userId} />
      </div>
    </div>
  );
}
