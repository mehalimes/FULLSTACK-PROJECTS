import { useDispatch, useSelector } from "react-redux";
import { setField } from "../slices/appSlice";
import "./../globals.css";

export default function Input(props) {
  const { variable, placeholder, className } = props;

  const dispatch = useDispatch();
  const currentValue = useSelector((state) => state.app[variable]);

  const onChangeEvent = (event) => {
    const newValue = event.target.value;
    dispatch(setField({ field: variable, value: newValue }));
  };

  return (
    <input
      onChange={onChangeEvent}
      value={currentValue}
      placeholder={placeholder}
      className={`w-[210px] h-[40px] text-[15px] bg-white rounded-[10px] outline-none pl-[10px] border-2 bolder-solid border-black mx-auto font-poppins ${className}`}
    />
  );
}
