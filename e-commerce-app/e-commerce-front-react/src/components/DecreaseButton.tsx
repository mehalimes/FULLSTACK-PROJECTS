import axios from "axios";
import { CartItemInterface } from "../interfaces/CartItemInterface";
import { useAppDispatch } from "../hooks";
import { setField } from "../appSlice";

interface DecreaseButtonPropsInterface {
  productId: number;
  userId: number;
}

export default function DecreaseButton(props: DecreaseButtonPropsInterface) {
  const { productId, userId } = props;
  const endpoint = process.env.REACT_APP_API_ENDPOINT!;
  const dispatch = useAppDispatch();

  const decreaseButtonStyle = {
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

  const decreaseButtonEvent = () => {
    axios
      .delete((endpoint + "/deleteFromCart").toString(), {
        data: {
          userId: userId,
          productId: productId,
        },
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
          .catch((secondErr) => {});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button
      className="decrease-button"
      style={decreaseButtonStyle}
      onClick={decreaseButtonEvent}
    >
      -
    </button>
  );
}
