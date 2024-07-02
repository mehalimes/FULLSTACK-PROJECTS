import React, { useState } from "react";
import Input from "./../components/Input";
import "./../styles/AddProductPanel.css";
import Button from "./../components/Button";
import axios from "axios";
import { useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";

export default function AddProductPanel() {
  const [image, setImage] = useState<File | null>(null);

  const uploadPreset: string = process.env.REACT_APP_UPLOAD_PRESET!;
  const cloudName: string = process.env.REACT_APP_CLOUD_NAME!;
  const endpoint: string = process.env.REACT_APP_API_ENDPOINT!;

  const productName = useAppSelector((state) => state.app.productName);
  const productPrice = useAppSelector((state) => state.app.productPrice);

  const navigate = useNavigate();

  const addProductEvent = (): void => {
    if (image !== null) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", uploadPreset);
      axios
        .post(
          "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload",
          formData
        )
        .then((res) => {
          const publicID = res.data.public_id;
          axios
            .post((endpoint + "/addProduct").toString(), {
              name: productName,
              price: productPrice,
              publicId: publicID,
            })
            .then((secondRes) => {
              alert("Product Successfully Added.");
              navigate("/admin-panel");
            })
            .catch((secondErr) => {
              console.log("secErr", secondErr);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      return;
    }
  };

  const fileInputChangeEvent = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    let firstFile = event.target.files![0];
    setImage(firstFile);
  };

  return (
    <div id="add-product-panel-con">
      <div id="add-product-panel-sub-con">
        <h2>ADD PRODUCT</h2>
        <Input variable="productName" type="text" placeholder="Product Name" />
        <Input
          variable="productPrice"
          type="text"
          placeholder="Product Price"
        />
        <input
          type="file"
          onChange={(e) => {
            fileInputChangeEvent(e);
          }}
        />
        <Button name="Submit" width={100} height={50} Event={addProductEvent} />
      </div>
    </div>
  );
}
