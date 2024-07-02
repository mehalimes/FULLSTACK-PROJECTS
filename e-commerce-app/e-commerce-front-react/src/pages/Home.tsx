import { useEffect } from "react";
import Footer from "./../components/Footer";
import "./../styles/Home.css";
import Product from "../components/Product";
import { useAppDispatch, useAppSelector } from "../hooks";
import axios from "axios";
import { setField } from "../appSlice";
import { ProductInterface } from "../interfaces/ProductInterface";
import Navbar from "../components/Navbar";

export default function Home() {
  const allProducts = useAppSelector((state) => state.app.allProducts);
  const cloudName: string = process.env.REACT_APP_CLOUD_NAME!;
  const endpoint: string = process.env.REACT_APP_API_ENDPOINT!;
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get((endpoint + "/getAllProducts").toString())
      .then((res) => {
        let productArray: ProductInterface[] = [];
        res.data.map((item: ProductInterface) => {
          productArray.push(item);
        });
        dispatch(setField({ field: "allProducts", value: productArray }));
        productArray = [];
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <Navbar />
      <div id="main-con" className="row">
        {allProducts.length === 0 ? (
          // bootstrap spinner
          <div className="spinner-border text-warning"></div>
        ) : (
          allProducts.map((item) => {
            const imgSrc =
              "https://res.cloudinary.com/" +
              cloudName +
              "/image/upload/v1712251427/" +
              item.publicId;
            return (
              <Product
                id={item.productId}
                src={imgSrc}
                name={item.name}
                price={item.price}
              />
            );
          })
        )}
      </div>
      <Footer />
    </>
  );
}
