import axios from "axios";
import { React, useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./../globals.css";

export default function Verify() {
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
  const [verifySuccess, setVerifySuccess] = useState(false);

  useLayoutEffect(async () => {
    try {
      const verifyResponse = await axios.post(`${apiEndpoint}/verifyToken`, {
        email: email,
        token: token,
      });
      setVerifySuccess(true);
    } catch (err) {
      setVerifySuccess(false);
    }
  }, []);

  return (
    <>
      <h1 className={`text-5xl font-poppins`} style={verifySuccess ? { color : "#4bb543" } : { color : "red" }}>
        {verifySuccess ? "Verified Successfully" : "Verify Unsuccessfull"}
      </h1>
    </>
  );
}
