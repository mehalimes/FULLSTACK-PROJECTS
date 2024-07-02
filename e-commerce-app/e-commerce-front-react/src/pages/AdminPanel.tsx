import React, { useEffect } from "react";
import { ProductInterface } from "./../interfaces/ProductInterface";
import "./../styles/AdminPanel.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setField } from "../appSlice";
import AdminProduct from "../components/AdminProduct";

export default function AdminPanel() {
  const endpoint: string = process.env.REACT_APP_API_ENDPOINT!;
  const cloudName: string = process.env.REACT_APP_CLOUD_NAME!;

  const allProducts: ProductInterface[] = useAppSelector(
    (state) => state.app.allProducts
  );

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
    <div id="admin-panel-con">
      <div id="left">
        <div className="title-con" id="first-title-con">
          Orders
        </div>
        <div id="left-con"></div>
      </div>
      <div id="right">
        <div className="title-con">Products</div>
        <div id="right-con">
          <div id="products-con">
            {allProducts.length === 0 ? (
              <div className="spinner-border text-warning"></div>
            ) : (
              allProducts.map((item: ProductInterface) => {
                return (
                  <AdminProduct
                    id={item.productId}
                    name={item.name}
                    price={item.price}
                    src={
                      "https://res.cloudinary.com/" +
                      cloudName +
                      "/image/upload/v1712251427/" +
                      item.publicId
                    }
                    publicId={item.publicId}
                  />
                );
              })
            )}
          </div>
          <div id="add-product-con">
            <Link to="/add-product" id="add-product-button">
              Add Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
