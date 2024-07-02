import { useState } from "react";
import Button from "./../components/Button";
import "./../styles/AdminProduct.css";
import axios from "axios";

interface AdminProductProps {
  id: number;
  src: string;
  name: string;
  price: number;
  publicId: string;
}

export default function AdminProduct(props: AdminProductProps) {
  const [ID, setID] = useState(props.id);
  const [publicID, setPublicID] = useState(props.publicId);

  const endpoint: string = process.env.REACT_APP_API_ENDPOINT!;
  const cloudName: string = process.env.REACT_APP_CLOUD_NAME!;
  const apiKey: string = process.env.REACT_APP_API_KEY!;
  const apiSecret: string = process.env.REACT_APP_API_SECRET!;

  const deleteEvent = (): void => {
    axios
      .delete((endpoint + "/deleteImage").toString(), {
        data: { publicID: publicID },
      })
      .then((res) => {
        axios
          .delete((endpoint + "/deleteProduct").toString(), {
            data: { id: ID },
          })
          .then((secondRes) => {
            console.log(secondRes);
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
    <div className="admin-product-con">
      <div className="admin-product-image-con">
        <img src={props.src} className="admin-product-image" alt={props.name} />
      </div>
      <div className="admin-product-properties-con">
        <div className="admin-product-name">{props.name}</div>
        <div className="admin-product-price">{props.price + " TL"}</div>
      </div>
      <div className="admin-product-button-con">
        <Button name="Delete" width={70} height={40} Event={deleteEvent} />
      </div>
    </div>
  );
}
