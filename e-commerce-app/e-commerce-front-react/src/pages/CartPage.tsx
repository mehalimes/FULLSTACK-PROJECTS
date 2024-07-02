import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useAppDispatch, useAppSelector } from "../hooks";
import { CartItemInterface } from "../interfaces/CartItemInterface";
import store from "../store";
import { setField } from "../appSlice";
import CartItem from "../components/CartItem";
import "./../styles/CartPage.css";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const endpoint = process.env.REACT_APP_API_ENDPOINT!;
  const userIdRedux = useAppSelector((state) => state.app.userId);
  const cartItems: CartItemInterface[] = useAppSelector(
    (state) => state.app.cartItems
  );
  const navigate = useNavigate();

  const cloudName = process.env.REACT_APP_CLOUD_NAME!;
  const [isReduxLoaded, setIsReduxLoaded] = useState(false);
  const dispatch = useAppDispatch();

  const submitCartEvent = (): void => {
    navigate("/payment-page");
  };

  useEffect(() => {
    const reduxListener = () => {
      setIsReduxLoaded(true);
    };

    const unsubscribe = store.subscribe(reduxListener);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isReduxLoaded === true) {
      axios
        .post((endpoint + "/getCartProducts").toString(), { id: userIdRedux })
        .then((res) => {
          let cartItemsArray: CartItemInterface[] = [];
          res.data.map((item: CartItemInterface) => {
            cartItemsArray.push(item);
          });
          dispatch(setField({ field: "cartItems", value: cartItemsArray }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isReduxLoaded]);

  return (
    <>
      <Navbar />
      <div className="cart-page-con">
        {isReduxLoaded ? (
          cartItems.length === 0 ? (
            <h1>Sepette Ürün Yok</h1>
          ) : (
            <>
              {cartItems.map((item: CartItemInterface) => {
                let imgSrc =
                  "https://res.cloudinary.com/" +
                  cloudName +
                  "/image/upload/v1712251427/" +
                  item.product.publicId;
                return (
                  <CartItem
                    src={imgSrc}
                    name={item.product.name}
                    price={item.product.price}
                    quantity={item.quantity}
                    productId={item.product.productId}
                    userId={userIdRedux}
                  />
                );
              })}
              <Button
                name="Sepeti Onayla"
                Event={submitCartEvent}
                width={150}
                height={50}
              />
            </>
          )
        ) : (
          <div className="spinner-border text-warning"></div>
        )}
      </div>
      <Footer />
    </>
  );
}
