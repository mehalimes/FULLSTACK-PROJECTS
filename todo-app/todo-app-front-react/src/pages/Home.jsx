import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import TodoItem from "../components/TodoItem.jsx";
import icon from "./../images/icon.jpg";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetRedux, setField } from "../slices/appSlice.jsx";
import { useEffect } from "react";
import "./../globals.css";
import "./../styles/Home.css";

export const updateData = async (email, dispatch, apiEndpoint) => {
  const getAllTodosResult = await axios.post(`${apiEndpoint}/getAllTodos`, {
    email: email,
  });
  let todoItemArray = [];
  getAllTodosResult.data.map((item, index, array) => {
    todoItemArray.push(item);
  });
  dispatch(setField({ field: "todoItemArray", value: todoItemArray }));
};

export default function Home() {
  const loginSuccess = useSelector((state) => state.app.loginSuccess);
  const email = useSelector((state) => state.app.email);
  let todoItemArray = useSelector((state) => state.app.todoItemArray);
  let todoInput = useSelector((state) => state.app.todoInput);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOutEvent = async (event) => {
    try {
      const logOutResponse = await axios.post(`${apiEndpoint}/logout`);
      localStorage.removeItem("JWT_TOKEN");
      dispatch(setField({ field: "loginSuccess", value: false }));
      dispatch(resetRedux());
      navigate("/");
    } catch (err) {
      console.log("Hata : ", err);
    }
  };

  const solveJWT = async () => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      if(token != null){
        const jwtResponse = await axios.post(`${apiEndpoint}/decodeJwtToken`, {
          token: token,
        });
        const solvedEmail = jwtResponse.data.email;
        dispatch(setField({ field : "email", value : solvedEmail }));
        dispatch(setField({ field : "loginSuccess", value : true }));
      }
    } catch (err) {
      dispatch(setField({ field: "loginSuccess", value: false }));
      console.log(err);
    }
  };

  const addButtonEvent = async () => {
    try {
      if (todoInput) {
        const addResult = await axios.post(`${apiEndpoint}/addTodo`, {
          content: todoInput,
          email: email,
        });
        dispatch(setField({ field: "todoInput", value: "" }));
        updateData(email, dispatch, apiEndpoint);
      }
    } catch (err) {
      console.log("hata : ", err);
    }
  };

  useEffect(() => {
    const pageEvent = async () => {
      await solveJWT();
      await updateData(email, dispatch, apiEndpoint);
    };
    pageEvent();
  }, [email, dispatch, apiEndpoint]);

  if (loginSuccess) {
    return (
      <div className="w-[500px] h-[640px] bg-white border-2 border-solid border-black rounded-[20px] flex flex-col justify-center items-center">
        <h1 className="w-[496px] h-[75px] flex justify-center items-center bg-white rounded-[20px] text-3xl my-[10px]">TODO APP</h1>
        <h4 className="flex justify-center items-center mb-[10px]">
          <img src={icon} className="w-[25px] h-[25px]"/>
          &nbsp;&nbsp;&nbsp;<span className="font-poppins">{email}</span>&nbsp;&nbsp;&nbsp;
          <Button name="LOGOUT" event={logOutEvent} />
        </h4>
        <div className="w-[496px] h-[75px] bg-white flex items-center">
          <Input
            variable="todoInput"
            placeholder="Add Todo"
            className="mx-auto ml-[95px]"
          />
          <Button
            name="ADD"
            event={addButtonEvent}
            className="mr-[90px]"
          />
        </div>
        <div className="w-[465px] h-[400px] mb-[100px] overflow-y-scroll overflow-x-hidden pr-[100px]">
          {todoItemArray.map((item, index, array) => {
            return (
              <TodoItem id={item.id} content={item.content} key={item.id} />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-[450px] h-[350px] flex justify-center items-center border-2 border-solid border-black rounded-[20px]">
        <h1 className="text-3xl font-poppins">You are not logged in</h1>
      </div>
    );
  }
}
