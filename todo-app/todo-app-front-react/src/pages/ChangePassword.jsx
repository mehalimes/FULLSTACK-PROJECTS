import React from "react";
import Button from "../components/Button";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

  const inputOnChangeEvent = async (event) => {
    setNewPassword(event.target.value);
  };

  const changePasswordEvent = async () => {
    try{
      const changePasswordResult = await axios.post(`${apiEndpoint}/changePassword`, { email : email, token : token, newPassword : newPassword });
      setSuccess(true);
    }
    catch(err){
      setSuccess(false);
      console.log(err);
    }
  };

  return (
    <div className="w-[400px] h-[400px] border-2 border-solid border-black rounded-[20px] flex flex-col">
      <h1 className="text-3xl font-poppins mx-auto mt-[70px] mb-[40px]">CHANGE PASSWORD</h1>
      <h5 className={`font-poppins mx-auto mb-[40px]`} style={success ? { color : "#4bb543" } : { color : "red" }}>{success ? "Password Changed Successfully" : "Password Couldn't Change"}</h5>
      <input className="mx-auto w-[210px] h-[40px] text-[15px] bg-white outline-none rounded-[10px] pl-[10px] border-2 border-solid border-black mb-[40px] font-poppins" value={newPassword} onChange={inputOnChangeEvent} placeholder={"New Password"}/>
      <Button name="CHANGE PASSWORD" event={changePasswordEvent}/>
    </div>
  );
}
