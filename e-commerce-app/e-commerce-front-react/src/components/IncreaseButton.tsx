import axios from "axios";
import { CartItemInterface } from "../interfaces/CartItemInterface";
import { useAppDispatch } from "../hooks";
import { setField } from "../appSlice";

interface IncreaseButtonPropsInterface {
  productId: number;
  userId: number;
}

export default function IncreaseButton(props: IncreaseButtonPropsInterface) {
  const endpoint = process.env.REACT_APP_API_ENDPOINT!;
  const dispatch = useAppDispatch();
  const { productId, userId } = props;

  const increaseButtonStyle = {
    fontSize: "20px",
    backgroundColor: "#ffbf00",
    width: "25px",
    height: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    border: "3px solid black",
  };

  const increaseButtonEvent = () => {
    axios
      .post((endpoint + "/addToCart").toString(), {
        userId: userId,
        productId: productId,
      })
      .then((res) => {
        axios
          .post((endpoint + "/getCartProducts").toString(), { id: userId })
          .then((secondRes) => {
            let cartItemsArray: CartItemInterface[] = [];
            secondRes.data.map((item: CartItemInterface) => {
              cartItemsArray.push(item);
            });
            dispatch(setField({ field: "cartItems", value: cartItemsArray }));
            cartItemsArray = [];
          })
          .catch((secondErr) => {
            console.log(secondErr);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button
      className="increase-button"
      style={increaseButtonStyle}
      onClick={increaseButtonEvent}
    >
      +
    </button>
  );
}
