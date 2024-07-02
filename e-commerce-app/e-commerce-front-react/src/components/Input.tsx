import React, { useState } from "react";
import { setField } from "../appSlice";
import { useAppDispatch } from "../hooks";
import "./../styles/Input.css";

interface InputProps {
  variable: string;
  type: string;
  placeholder: string;
  style?: React.CSSProperties;
  isCardNumberInput?: boolean;
  isCardOwnerNameInput?: boolean;
  isExpireYearInput?: boolean;
  isCVCInput?: boolean;
}

export default function Input(props: InputProps) {
  const {
    variable,
    type,
    placeholder,
    style,
    isCardNumberInput,
    isCardOwnerNameInput,
    isExpireYearInput,
    isCVCInput,
  } = props;
  const dispatch = useAppDispatch();

  const [value, setValue] = useState("");

  const inputChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const length = newValue.length;
    if (isCardNumberInput === true) {
      let cardNumber: string = "";
      for (let i = 0; i < length; i++) {
        cardNumber += newValue[i];
        if (i !== 0 && i % 3 === 0 && newValue[i] !== " ") {
          cardNumber += " ";
        }
      }
      setValue(cardNumber);
    }
    dispatch(setField({ field: variable, value: newValue }));
  };

  return (
    <input
      value={value}
      onChange={inputChangeEvent}
      type={type}
      placeholder={placeholder}
      style={style}
    />
  );
}
