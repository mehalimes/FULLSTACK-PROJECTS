import "./../styles/Product.css";
import { useNavigate } from "react-router-dom";

interface ProductProps {
  id: number;
  src: string;
  name: string;
  price: number;
}

export default function Product(props: ProductProps) {
  const navigate = useNavigate();

  const productClickEvent = () => {
    navigate(`/product-page/${props.id}`);
  };

  return (
    <div
      className="product-con col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1"
      onClick={productClickEvent}
    >
      <div className="product-image-con">
        <img className="product-image" src={props.src} />
      </div>
      <div className="product-name-con">
        <h5>{props.name}</h5>
      </div>
      <div className="product-price-con">
        <h5>{props.price + " TL"}</h5>
      </div>
    </div>
  );
}
