import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "./../components/Input";
import Button from "./../components/Button";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { setField } from "../slices/appSlice";
import { useEffect } from "react";
import "./../globals.css";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
  const currentEndpoint = process.env.REACT_APP_CURRENT_ENDPOINT;
  const serviceID = process.env.REACT_APP_SERVICE_ID;
  const templateID = process.env.REACT_APP_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;

  const email = useSelector((state) => state.app.email);
  const password = useSelector((state) => state.app.password);
  const loginSuccess = useSelector((state) => state.app.loginSuccess);
  const registerSuccess = useSelector((state) => state.app.registerSuccess);

  const loginEvent = async (event) => {
    try {
      const loginResponse = await axios.post(`${apiEndpoint}/login`, {
        email: email,
        password: password,
      });
      const jwtToken = loginResponse.data;
      localStorage.setItem("JWT_TOKEN", jwtToken);
      navigate("/home");
      dispatch(setField({ field : "loginSuccess", value : true }));
    } catch (err) {
      console.log("Hata : ", err);
      dispatch(setField({ field : "loginSuccess", value : false }));
    }
  };

  const pageEvent = async () => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      if (token != null) {
        const jwtResponse = await axios.post(`${apiEndpoint}/decodeJwtToken`, {
          token: token,
        });
        const solvedEmail = jwtResponse.data.email;
        dispatch(setField({ field: "email", value: solvedEmail }));
        dispatch(setField({ field: "loginSuccess", value: true }));
      }
    } catch (err) {
      dispatch(setField({ field: "loginSuccess", value: false }));
      console.log(err);
    }
  };

  useEffect(() => {
    pageEvent();
  }, []);

  const registerEvent = async (event) => {
    try {
      const registerResponse = await axios.post(`${apiEndpoint}/register`, {
        email: email,
        password: password,
      });

      const templateParams = {
        to_email: email,
        link: `${currentEndpoint}/verify?email=${email}&token=${encodeURIComponent(
          registerResponse.data
        )}`,
        content: "VERIFY LINK",
      };

      const emailResponse = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );

      dispatch(setField({ field: "registerSuccess", value: true }));
    } catch (err) {
      console.log("Hata :", err);
    }
  };

  const forgotPasswordEvent = async () => {
    navigate("/forgot-password-link-sender");
  };

  return (
    <div className="sm:w-[700px] sm:h-[500px] sm:bg-white sm:flex sm:flex-row sm:border-2 sm:border-solid sm:border-black rounded-[20px] w-[375px] h-[900px] flex flex-col border-2 border-solid border-black mt-[20px] mb-[20px]">
      <div className="w-[350px] h-[490px] bg-white flex flex-col rounded-[20px]">
        <h1 className="mx-auto mt-[50px] mb-[40px] text-3xl font-poppins">LOGIN</h1>
        <h5
          className={`mx-auto text-red-600 mb-[40px] text-sm font-poppins`}
          style={loginSuccess ? { color : "#4bb543" } : { color : "red" }}
        >
          {loginSuccess ? "Login Successfull" : "Login Unsuccessfull"}
        </h5>
        <Input placeholder={"Email"} variable="email" className="mx-auto mb-[40px]" />
        <Input
          placeholder={"Password"}
          variable="password"
          className="mx-auto mb-[40px]"
        />
        <Button
          name="LOGIN"
          event={loginEvent}
          className="mx-auto mb-[40px]"
        />
        <Button
          name="FORGOT PASSWORD"
          event={forgotPasswordEvent}
          className="mx-auto"
        />
      </div>
      <div className="w-[350px] h-[490px] bg-white flex flex-col rounded-[20px]">
        <h1 className="mx-auto mt-[50px] mb-[40px] text-3xl font-poppins">REGISTER</h1>
        <h5
          className={`mx-auto text-red-600 mb-[40px] text-sm font-poppins`}
          style={registerSuccess ? { color : "#4bb543" } : { color : "red" }}
        >
          {registerSuccess
            ? "Verify Link Sent To Your Email"
            : "Register Unsuccessfull"}
        </h5>
        <Input placeholder={"Email"} variable="email" className="mb-[40px]" />
        <Input
          placeholder={"Password"}
          variable="password"
          className="mx-auto mb-[40px]"
        />
        <Button name="REGISTER" event={registerEvent} />
      </div>
    </div>
  );
}
