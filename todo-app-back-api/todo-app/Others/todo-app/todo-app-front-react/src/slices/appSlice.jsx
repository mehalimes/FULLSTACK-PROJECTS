import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: 'appslice',
    initialState: {
        loginFirst: "",
        loginSecond: "",

        registerFirst: "",
        registerSecond: "",

        todoFirst: "",
        loginSuccess: false,
        registerSuccess: false,
        verifySuccess: false,
        currentEmail: "",
        verifyFirst: "",
        verifySecond: "",
        todoItemArray : [],

        forgotPasswordEmail : "",
        forgotPasswordToken: "",
        forgotPasswordNewPassword: "",
        forgotPasswordTokenSuccess: false,
        forgotPasswordChangeSuccess: false
    },
    reducers: {
        setLoginFirst: (state, action) => {
            state.loginFirst = action.payload;
        },
        setLoginSecond: (state, action) => {
            state.loginSecond = action.payload;
        },
        setLoginText: (state, action) => {
            state.loginText = action.payload;
        },
        setRegisterText: (state, action) => {
            state.registerText = action.payload;
        },
        setRegisterFirst: (state, action) => {
            state.registerFirst = action.payload;
        },
        setRegisterSecond: (state, action) => {
            state.registerSecond = action.payload;
        },
        setTodoFirst: (state, action) => {
            state.todoFirst = action.payload;
        },
        setLoginSuccess: (state, action) => {
            state.loginSuccess = action.payload;
        },
        setRegisterSuccess: (state, action) => {
            state.registerSuccess = action.payload;
        },
        setVerifySuccess: (state, action) => {
            state.verifySuccess = action.payload;
        },
        setCurrentEmail : (state, action) => {
            state.currentEmail = action.payload;
        },
        setVerifyFirst: (state, action) => {
            state.verifyFirst = action.payload;
        },
        setVerifySecond: (state, action) => {
            state.verifySecond = action.payload;
        },
        setTodoItemArray: (state, action) => {
            return {
                ...state,
                todoItemArray: [...action.payload]
            };
        },

        setForgotPasswordEmail : (state, action) => {
            state.forgotPasswordEmail = action.payload;
        },
        setForgotPasswordToken : (state, action) => {
            state.forgotPasswordToken = action.payload;
        },
        setForgotPasswordNewPassword : (state, action) => {
            state.forgotPasswordNewPassword = action.payload;
        },
        setForgotPasswordTokenSuccess : (state, action) => {
            state.forgotPasswordTokenSuccess = action.payload;
        },
        setForgotPasswordChangeSuccess : (state, action) => {
            state.forgotPasswordChangeSuccess = action.payload;
        }
    }
});

export const {
    setLoginFirst,
    setLoginSecond,
    setLoginText,
    setRegisterText,
    setRegisterFirst,
    setRegisterSecond,
    setTodoFirst,
    setLoginSuccess,
    setRegisterSuccess,
    setCurrentEmail,
    setVerifyFirst,
    setVerifySecond,
    setVerifySuccess,
    setTodoItemArray,

    setForgotPasswordEmail,
    setForgotPasswordToken,
    setForgotPasswordNewPassword,
    setForgotPasswordTokenSuccess,
    setForgotPasswordChangeSuccess
} = appSlice.actions;

export default appSlice.reducer;