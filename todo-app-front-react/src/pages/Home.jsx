import React, { useEffect, useState } from "react";
import "./../styles/Home.css";
import { useDispatch, useSelector } from "react-redux";
import TodoItemComponent from "../components/TodoItem.jsx";
import { setCurrentEmail, setLoginSuccess, setTodoFirst, setTodoItemArray } from "../slices/appSlice";
import axios from "axios";
import icon from "./../images/icon.jpg";
import { useNavigate } from "react-router-dom";
import { current } from "@reduxjs/toolkit";

export default function HomeComponent() {
    const dispatch = useDispatch();
    const currentEmail = useSelector((state) => state.app.currentEmail);
    const loginSuccess = useSelector((state) => state.app.loginSuccess);
    const todoFirst = useSelector((state) => state.app.todoFirst);
    const navigate = useNavigate();
    const todoItemArray = useSelector((state) => state.app.todoItemArray);
    var currentArray = [];

    useEffect(() => {
        if(localStorage.getItem("jwt") != null) {
            var jwtToken = (localStorage.getItem("jwt"));
            axios.post("https://localhost:7145/api/TodoApp/decodeJwtToken", { Token: jwtToken })
                .then(response => {
                    if(response.data != null) {
                        dispatch(setLoginSuccess(true));
                        dispatch(setCurrentEmail(response.data));
                    }
                })
                .catch(error => {
                    console.warn(error);
                });
        }
        else {
            dispatch(setLoginSuccess(false));
        }
    }, []);

    useEffect(() => {
        axios.post("https://localhost:7145/api/TodoApp/getAllTodos", { Email: currentEmail })
            .then(response => {
                response.data.map((item, index, array) => {
                    currentArray.push(item.todoItem);
                });
                dispatch(setTodoItemArray(currentArray));
            })
            .catch(error => {
                console.log(error);
            });
    }, [currentEmail]);

    const logOutEvent = () => {
        axios.post("https://localhost:7145/api/TodoApp/logout")
            .then(response => {
                localStorage.removeItem("jwt");
                navigate("/");
            })
            .catch(error => {
                console.log(error);
            });
    };

    const addTodoEvent = (email, todoItem) => {
        axios.post("https://localhost:7145/api/TodoApp/addTodo", { Id: "0", TodoItem: todoItem, Email: email})
            .then(response => {
                axios.post("https://localhost:7145/api/TodoApp/getAllTodos", { Email: currentEmail })
                    .then(secondResponse => {
                        document.getElementById("home-input").value = "";
                        currentArray = [];
                        secondResponse.data.map((item, index, array) => {
                            currentArray.push(item.todoItem);
                        });
                        dispatch(setTodoItemArray(currentArray));
                    })
                    .catch(secondError => {
                        console.log(secondError);
                    });
            })
            .catch(error => {
                console.log(error);
            })
    };

    const addTodoInputFunc = (event) => {
        const newValue = event.target.value;
        dispatch(setTodoFirst(newValue));
    };

    if(loginSuccess) {
        return (
            <div id="home-container">
                <h1 id="home-h1">TODO APP</h1>
                <h4><img src={icon} id="home-user-icon"/>&nbsp;&nbsp;{currentEmail}&nbsp;&nbsp;<button id="home-logout" onClick={logOutEvent}>LOGOUT</button></h4>
                <div id="home-sub-container-1">
                    <input id="home-input" placeholder="Add Todo" onChange={addTodoInputFunc} value={todoFirst}/>
                    <button id="home-add-button" onClick={() => addTodoEvent(currentEmail, todoFirst)}>ADD</button>
                </div>
                <div id="home-sub-container-2">
                    {todoItemArray.map((item, index, array) => (
                        <TodoItemComponent content={item} key={index}/>
                    ))}
                </div>
            </div>
        );
    }
    else {
        return (
            <div id="home-error-page">
                <h1>You are not logged in</h1>
            </div>
        );
    }
}