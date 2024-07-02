import Input from "../components/Input";
import "./../styles/Login.css";
import Button from "../components/Button";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setField } from "../appSlice";

export default function Login() {
  const email = useAppSelector((state) => state.app.email);
  const password = useAppSelector((state) => state.app.password);

  let endpoint: string = process.env.REACT_APP_API_ENDPOINT!;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loginEvent = () => {
    axios
      .post((endpoint + "/login").toString(), {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          let JWT_TOKEN = res.data.token.result;
          console.log(JWT_TOKEN);
          localStorage.setItem("JWT_TOKEN", JWT_TOKEN);
          dispatch(setField({ field: "loginSuccess", value: true }));
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div id="login-con">
      <div id="login-sub-con">
        <h2>LOGIN</h2>
        <Input variable="email" type="text" placeholder="Email" />
        <Input variable="password" type="password" placeholder="Password" />
        <Button name="Login" width={130} height={40} Event={loginEvent} />
        <h5>
          Dont have an account ?{" "}
          <Link to="/register" className="register-link">
            Register
          </Link>{" "}
        </h5>
      </div>
    </div>
  );
}
