import React from "react"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { updateData } from "../pages/Home";

export default function TodoItem(props) {
  const { id, content } = props;

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

  const email = useSelector((state) => state.app.email);
  const todoInput = useSelector((state) => state.app.todoInput);
  const dispatch = useDispatch();

  const deleteEvent = async () => {
    try {
      const deleteResult = await axios.delete(`${apiEndpoint}/deleteTodo`, {
        data: { id: id },
      });
      updateData(email, dispatch, apiEndpoint);
    } catch (err) {
      console.log("Hata : ", err);
    }
  };

  const updateEvent = async () => {
    try {
      const updateResult = await axios.put(`${apiEndpoint}/putTodo`, {
        id: id,
        content: todoInput,
      });
      updateData(email, dispatch, apiEndpoint);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[450px] h-[50px] border-2 border-solid border-black bg-white flex flex-row justify-evenly items-center rounded-[20px] mt-[5px]">
      <div className="w-[270px] h-[46px] bg-white flex items-center ml-[20px] mr-auto">{content}</div>
      <Button className="" name="EDIT" event={updateEvent}/>
      <Button className="mr-[10px] ml-auto" name="DELETE" event={deleteEvent} />
    </div>
  );
}
