import React from "react";
import "./../styles/TodoItem.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setTodoItemArray } from "../slices/appSlice";

export default function TodoItemComponent(props) {
    const todoFirst = useSelector((state) => state.app.todoFirst);
    const currentEmail = useSelector((state) => state.app.currentEmail);
    const todoItemArray = useSelector((state) => state.app.todoItemArray);
    const dispatch = useDispatch();
    var currentArray = [];

    const editClickEvent = (content, email) => {
        axios.post("https://localhost:7145/api/TodoApp/putTodo", { TodoItemFirst: content, EmailFirst: email, TodoItemSecond: todoFirst, EmailSecond: email })
            .then(response => {
                axios.post("https://localhost:7145/api/TodoApp/getAllTodos", { Email: currentEmail })
                    .then(secondResponse => {
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
            });
    };

    const deleteClickEvent = (content, email) => {
        axios.post("https://localhost:7145/api/TodoApp/deleteTodo", { Id: "0", TodoItem: content, Email: email })
            .then(response => {
                axios.post("https://localhost:7145/api/TodoApp/getAllTodos", { Email: currentEmail })
                    .then(response => {
                        currentArray = [];
                        response.data.map((item, index, array) => {
                            currentArray.push(item.todoItem);
                        });
                        dispatch(setTodoItemArray(currentArray));
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div className="todo-item-container">
            <div className="todo-item-content">{ props.content }</div>
            <button className="todo-item-edit" onClick={() => editClickEvent(props.content, currentEmail)}>EDIT</button>
            <button className="todo-item-delete" onClick={() => deleteClickEvent(props.content, currentEmail)}>DELETE</button>
        </div>
    )
}