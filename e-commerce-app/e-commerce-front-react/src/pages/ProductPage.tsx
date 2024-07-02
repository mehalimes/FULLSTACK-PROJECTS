import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./../styles/ProductPage.css";
import Button from "./../components/Button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ProductInterface } from "../interfaces/ProductInterface";
import { useAppSelector } from "../hooks";

export default function ProductPage() {
  const { ID } = useParams();

  const endpoint = process.env.REACT_APP_API_ENDPOINT!;
  const cloudName = process.env.REACT_APP_CLOUD_NAME!;

  const userId = useAppSelector((state) => state.app.userId);

  const [product, setProduct] = useState<ProductInterface>({
    productId: 0,
    name: "",
    price: 0,
    publicId: "",
  });

  const addCartEvent = (): void => {
    axios
      .post((endpoint + "/addToCart").toString(), {
        userId: userId,
        productId: ID,
      })
      .then((res) => {
        alert("Product Added To Cart");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .post((endpoint + "/getProduct").toString(), { id: ID })
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ID]);

  return (
    <>
      <Navbar />
      <div id="product-page-con">
        <div id="product-page-sub-con">
          {product.name === "" ? (
            <div className="spinner-border"></div>
          ) : (
            <>
              <div id="product-page-left">
                <img
                  id="product-page-image"
                  src={
                    "https://res.cloudinary.com/" +
                    cloudName +
                    "/image/upload/v1712251427/" +
                    product.publicId
                  }
                  alt={product.name}
                />
              </div>
              <div id="product-page-right">
                <h3>{product.name}</h3>
                <h3>{product.price + " TL"}</h3>
                <Button
                  name="Sepete Ekle"
                  Event={addCartEvent}
                  width={150}
                  height={50}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
