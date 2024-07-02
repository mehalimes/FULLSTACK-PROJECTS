import React from "react";
import Input from "./../components/Input";
import Button from "./../components/Button";
import "./../styles/Admin.css";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../hooks";
import { useNavigate } from "react-router-dom";
import { setField } from "../appSlice";

export default function Admin() {

    const endpoint: string = process.env.REACT_APP_API_ENDPOINT!;
    const adminPassword: string = useAppSelector((state) => state.app.adminPassword);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const adminEnterEvent = () => {
        axios.post((endpoint + "/adminLogin"), { password: adminPassword })
            .then(res => {
                if (res.status === 200) {
                    dispatch(setField({ field: "adminLoginSuccess", value: true }));
                    navigate("/admin-panel");
                }
            })
            .catch(err => {
                navigate("/home");
            });
    };

    return (
        <div id="admin-con">
            <div id="admin-sub-con">
                <h2>ADMIN</h2>
                <Input variable="adminPassword" type="password" placeholder="Password" />
                <Button name="Enter" width={130} height={40} Event={adminEnterEvent} />
            </div>
        </div>
    );
}