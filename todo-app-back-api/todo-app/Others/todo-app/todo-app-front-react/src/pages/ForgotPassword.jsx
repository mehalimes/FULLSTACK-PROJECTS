import React from "react";
import "./../styles/ForgotPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { 
    setForgotPasswordEmail, 
    setForgotPasswordNewPassword, 
    setForgotPasswordToken, 
    setForgotPasswordTokenSuccess, 
    setForgotPasswordChangeSuccess 
} from "../slices/appSlice";
import axios from "axios";

export default function ForgotPasswordComponent(){

    const forgotPasswordEmail = useSelector((state) => state.app.forgotPasswordEmail);
    const forgotPasswordToken = useSelector((state) => state.app.forgotPasswordToken);
    const forgotPasswordNewPassword = useSelector((state) => state.app.forgotPasswordNewPassword);
    const forgotPasswordTokenSuccess = useSelector((state) => state.app.forgotPasswordTokenSuccess);
    const forgotPasswordChangeSuccess = useSelector((state) => state.app.forgotPasswordChangeSuccess);

    const dispatch = useDispatch();

    const emailChangeEvent = (event) => {
        let newValue = event.target.value;
        dispatch(setForgotPasswordEmail(newValue));
    };

    const tokenChangeEvent = (event) => {
        let newValue = event.target.value;
        dispatch(setForgotPasswordToken(newValue));
    };

    const newPasswordChangeEvent = (event) => {
        let newValue = event.target.value;
        dispatch(setForgotPasswordNewPassword(newValue));
    };

    const sendToken = (email) => {
        axios.post("https://localhost:7145/api/TodoApp/forgotPassword", { Email: email })
            .then(response => {
                if(response.status == 200) {
                    dispatch(setForgotPasswordTokenSuccess(true));
                }
            })
            .catch(error => {
                dispatch(setForgotPasswordTokenSuccess(false));
                console.log(error);
            });
    };

    const changePassword = (email, token, newPassword) => {
        axios.post("https://localhost:7145/api/TodoApp/resetPassword", { Email: email, Token: token, NewPassword: newPassword })
            .then(response => {
                if(response.status == 200) {
                    dispatch(setForgotPasswordChangeSuccess(true));
                }
            })
            .catch(error => {
                dispatch(setForgotPasswordChangeSuccess(false));
            });
    };

    return (
        <div id="fp-container">
            <h1 id="fp-header">FORGOT PASSWORD</h1>
            <div id="fp-sub-container">
                <div id="fp-sub-container-1">
                    <h5 className={forgotPasswordTokenSuccess ? "success" : ""}>{forgotPasswordTokenSuccess ? "Token Sent Successfully" : "Token Cannot Sent"}</h5>
                    <input placeholder="Email" onChange={emailChangeEvent} value={forgotPasswordEmail}/>
                    <button id="fp-send-token-button" onClick={() => sendToken(forgotPasswordEmail)}>SEND TOKEN</button>
                </div>
                <div id="fp-sub-container-2">
                    <h5 className={forgotPasswordChangeSuccess ? "success" : ""}>{forgotPasswordChangeSuccess ? "Password Changed Successfully" : "Password Cannot Changed"}</h5>
                    <input placeholder="Email" onChange={emailChangeEvent} value={forgotPasswordEmail}/>
                    <input placeholder="Token" onChange={tokenChangeEvent} value={forgotPasswordToken}/>
                    <input placeholder="New Password" onChange={newPasswordChangeEvent} value={forgotPasswordNewPassword}/>
                    <button id="fp-change-button" onClick={() => changePassword(forgotPasswordEmail, forgotPasswordToken, forgotPasswordNewPassword)}>CHANGE</button>
                </div>
            </div>
        </div>
    );
}