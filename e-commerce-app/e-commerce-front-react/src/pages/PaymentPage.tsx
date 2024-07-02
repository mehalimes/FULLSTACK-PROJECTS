import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./../styles/PaymentPage.css";
import Input from "../components/Input";
import { useRef } from "react";

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <div id="payment-page-con">
        <Input
          type="uppercase"
          variable="cardHolderName"
          placeholder="Kart Sahibinin Adı Soyadı"
          style={{
            width: "290px",
          }}
        />
        <Input
          type="text"
          variable="cardNumber"
          placeholder="Kart Numarası"
          isCardNumberInput={true}
        />
        <label htmlFor="months">Kart Son Kullanma (Ay)</label>
        <select name="months">
          <option value="01">01</option>
          <option value="02">02</option>
          <option value="03">03</option>
          <option value="04">04</option>
          <option value="05">05</option>
          <option value="06">06</option>
          <option value="07">07</option>
          <option value="08">08</option>
          <option value="09">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <Input
          type="text"
          variable="expireYear"
          placeholder="Kart Son Kullanma (Yıl)"
        />
        <Input type="text" variable="cvc" placeholder="CVC" />
      </div>
      <Footer />
    </>
  );
}
