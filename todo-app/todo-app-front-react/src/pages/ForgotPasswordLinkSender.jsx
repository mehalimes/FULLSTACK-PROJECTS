import React from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ForgotPasswordLinkSender() {
  const [success, setSuccess] = useState(false);

  const email = useSelector((state) => state.app.email);

  const currentEndpoint = process.env.REACT_APP_CURRENT_ENDPOINT;
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
  const serviceID = process.env.REACT_APP_SERVICE_ID;
  const templateID = process.env.REACT_APP_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;

  const sendLinkEvent = async () => {
    try {
      const resetTokenEvent = await axios.post(`${apiEndpoint}/passwordResetToken`, { email : email });
      const resetToken = resetTokenEvent.data;
      const templateParams = {
        to_email: email,
        link: `${currentEndpoint}/change-password?email=${email}&token=${encodeURIComponent(resetToken)}`,
        content: "CHANGE PASSWORD",
      };
      const emailResponse = await emailjs.send(serviceID, templateID, templateParams, publicKey);
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
    }
  };

  return (
    <>
      <div className="w-[350px] h-[350px] border-2 border-solid border-black rounded-[20px]">
        <h1 className="mx-auto mt-[50px] mb-[40px] text-3xl font-poppins flex justify-center items-center">SEND LINK</h1>
        <h5 className={`text-red-600 mb-[40px] justify-center items-center flex font-poppins text-md`} style={success ? { color : "#4bb543" } : { color : "red" }}>
          {success ? "Link Sent Successfully" : "Link Couldn't Send"}
        </h5>
        <Input placeholder="Email" variable="email" className="block mx-auto mb-[40px]"/>
        <Button name="SEND LINK" event={sendLinkEvent} className="block mx-auto"/>
      </div>
    </>
  );
}
