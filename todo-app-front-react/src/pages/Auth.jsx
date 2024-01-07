import React, { useEffect } from "react";
import "./../styles/Auth.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoginFirst, setLoginSecond, setLoginSuccess, setRegisterFirst, setRegisterSecond, setRegisterSuccess, setVerifyFirst, setVerifySecond, setVerifySuccess } from "../slices/appSlice";
import axios from "axios";

export default function AuthComponent() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const verifyFirstValue = useSelector((state) => state.app.verifyFirst);
    const verifySecondValue = useSelector((state) => state.app.verifySecond);
    const verifySuccess = useSelector((state) => state.app.verifySuccess);
    const loginSuccess = useSelector((state) => state.app.loginSuccess);
    const registerSuccess = useSelector((state) => state.app.registerSuccess);
    const loginFirstValue = useSelector((state) => state.app.loginFirst);
    const loginSecondValue = useSelector((state) => state.app.loginSecond);
    const registerFirstValue = useSelector((state) => state.app.registerFirst);
    const registerSecondValue = useSelector((state) => state.app.registerSecond);

    const loginFirstFunc = (event) => {
        const newValue = event.target.value;
        dispatch(setLoginFirst(newValue));
    };
    const loginSecondFunc = (event) => {
        const newValue = event.target.value;
        dispatch(setLoginSecond(newValue));
    };
    const registerFirstFunc = (event) => {
        const newValue = event.target.value;
        dispatch(setRegisterFirst(newValue));
    };
    const registerSecondFunc = (event) => {
        const newValue = event.target.value;
        dispatch(setRegisterSecond(newValue));
    };
    const verifyFirstFunc = (event) => {
        const newValue = event.target.value;
        dispatch(setVerifyFirst(newValue));
    };
    const verifySecondFunc = (event) => {
        const newValue = event.target.value;
        dispatch(setVerifySecond(newValue));
    };
    const loginEvent = (email, password) => {
        axios.post("https://localhost:7145/api/TodoApp/login", { Username: email, Password: password })
            .then(response => {
                if(response.data.token != null) {
                    localStorage.setItem("jwt", response.data.token);
                    dispatch(setLoginSuccess(true));
                    navigate("/home");
                }
            })
            .catch(error => {
                dispatch(setLoginSuccess(false));
                localStorage.removeItem("jwt");
            });
    };

    const registerEvent = (email, password) => {
        axios.post("https://localhost:7145/api/TodoApp/register", { Username: email, Password: password })
            .then(response => {
                dispatch(setRegisterSuccess(true));
            })
            .catch(error => {
                // dispatch(setRegisterSuccess(false));
                console.log(error);
            });
    };

    const verifyEvent = (email, token) => {
        axios.post("https://localhost:7145/api/TodoApp/verify", { Username: email, Token: token })
            .then(response => {
                dispatch(setVerifySuccess(true));
            })
            .catch(error => {
                console.warn(error);
            })
    };

    useEffect(() => {
        if(localStorage.getItem("jwt") == null) {
            dispatch(setLoginSuccess(false));
        }
        else {
            var jwtToken = (localStorage.getItem("jwt"));
            axios.post("https://localhost:7145/api/TodoApp/decodeJwtToken", { Token: jwtToken })
                .then(response => {
                    if(response.data != null) {
                        dispatch(setLoginSuccess(true));
                    }
                })
                .catch(error => {
                    console.warn(error);
                });
        }
    }, []);

    const forgotPasswordEvent = () => {
        navigate("/forgotpassword");
    }
    
    return (
        <div id="auth-container">
            <div id="auth-login-container">
                <h1>LOGIN</h1>
                <h5 className={loginSuccess ? "success" : ""}>{loginSuccess ? "Login Successfull" : "Login Unsuccessfull"}</h5>
                <input placeholder="Email" id="auth-login-input-first" onChange={loginFirstFunc} value={loginFirstValue} />
                <input placeholder="Password" id="auth-login-input-second" onChange={loginSecondFunc} value={loginSecondValue} />
                <button type="submit" onClick={() => loginEvent(loginFirstValue, loginSecondValue)} id="auth-login-button">LOGIN</button>
                <button id="auth-forgot-password-button" onClick={forgotPasswordEvent}>FORGOT PASSWORD</button>
            </div>
            <div id="auth-register-container">
                <h1>REGISTER</h1>
                <h5 className={registerSuccess ? "success" : ""}>{registerSuccess ? "Token Sent To Your Email" : "Register Unsuccessfull"}</h5>
                <input placeholder="Email" id="auth-register-input-first" onChange={registerFirstFunc} value={registerFirstValue} />
                <input placeholder="Password" id="auth-register-input-second" onChange={registerSecondFunc} value={registerSecondValue} />
                <button type="submit" onClick={() => { registerEvent(registerFirstValue, registerSecondValue) }} id="auth-register-button">REGISTER</button>
            </div>
            <div id="auth-verify-container">
                <h1>VERIFY</h1>
                <h5 className={verifySuccess ? "success" : ""}>{verifySuccess ? "Verify Successfull" : "Verify Unsuccessfull"}</h5>
                <input placeholder="Email" id="auth-verify-input-first" onChange={verifyFirstFunc} value={verifyFirstValue} />
                <input placeholder="Token" id="auth-verify-input-second" onChange={verifySecondFunc} value={verifySecondValue} />
                <button type="submit" onClick={() => { verifyEvent(verifyFirstValue, verifySecondValue) }} id="auth-verify-button">VERIFY</button>
            </div>
        </div>
    );
}