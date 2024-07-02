import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductInterface } from "./interfaces/ProductInterface";
import { CartItemInterface } from "./interfaces/CartItemInterface";

interface appState {
    email: string;
    userId: number;
    password: string;
    loginSuccess: boolean;

    adminPassword: string;
    adminLoginSuccess: boolean;

    productName: string;
    productPrice: number;

    allProducts: ProductInterface[];
    cartItems: CartItemInterface[];

    cardHolderName: string;
    cardNumber: string;
    expireYear: string;
    cvc: string;
    amount: string;
    currency: string;
}

const initialState: appState = {
    email: "",
    userId: 0,
    password: "",
    adminPassword: "",
    adminLoginSuccess: false,

    productName: "",
    productPrice: 0,

    loginSuccess: false,
    allProducts: [],
    cartItems: [],

    cardHolderName: "",
    cardNumber: "",
    expireYear: "",
    cvc: "",
    amount: "",
    currency: "",
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setField: (state, action: PayloadAction<{ field: string; value: any }>) => {
            const { field, value } = action.payload;
            return {
                ...state,
                [field]: value,
            };
        },
        resetState: (state) => initialState,
    },
});

export const { setField, resetState } = appSlice.actions;
export default appSlice.reducer;
