import { Link, useNavigate } from "react-router-dom";
import "./../styles/Navbar.css";
import { useAppSelector, useAppDispatch } from "../hooks";
import { resetState, setField } from "../appSlice";
import { useLayoutEffect, useState } from "react";
import axios from "axios";
import MenuIcon from "./../images/bars-solid.svg";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const loginSuccess: boolean = useAppSelector(
    (state) => state.app.loginSuccess
  );

  const email: string = useAppSelector((state) => state.app.email);
  const endpoint: string = process.env.REACT_APP_API_ENDPOINT!;

  function logoutEvent(): void {
    axios
      .get(endpoint + "/logout")
      .then((res) => {
        if (res.status === 200) {
          dispatch(setField({ field: "loginSuccess", value: false }));
          localStorage.removeItem("JWT_TOKEN");
          dispatch(resetState());
          navigate("/home");
        }
      })
      .catch((err) => {
        dispatch(setField({ field: "loginSuccess", value: true }));
      });
  }

  const toggleMenuEvent = (): void => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const fetchData = async () => {
      let JWT_TOKEN = localStorage.getItem("JWT_TOKEN");

      if (JWT_TOKEN === null) {
        dispatch(setField({ field: "loginSuccess", value: false }));
      } else {
        try {
          const res = await axios.post(endpoint + "/decodeJwtToken", {
            token: JWT_TOKEN,
          });
          let firstKey = Object.keys(res.data.payload)[0];
          let firstValue = res.data.payload[firstKey];
          let secondKey = Object.keys(res.data.payload)[1];
          let secondValue = res.data.payload[secondKey];
          dispatch(setField({ field: "email", value: firstValue }));
          dispatch(setField({ field: "userId", value: secondValue }));
          dispatch(setField({ field: "loginSuccess", value: true }));
        } catch (err) {
          dispatch(setField({ field: "loginSuccess", value: false }));
          console.log(err);
        }
      }
    };

    fetchData();
  }, [dispatch, endpoint]);

  return (
    <>
      <div id="navbar-con">
        <div id="navbar-left">
          <h1>E TİCARET</h1>
        </div>
        <div id="navbar-right">
          {!loginSuccess && (
            <Link to="/login" className="link">
              Giriş Yap
            </Link>
          )}
          {loginSuccess && (
            <Link to="/home" className="link">
              {email}
            </Link>
          )}
          {loginSuccess && (
            <Link to="/order-page" className="link">
              Siparişler
            </Link>
          )}
          {loginSuccess && (
            <Link to="/cart-page" className="link">
              Sepetim
            </Link>
          )}
          {loginSuccess && (
            <Link to="#" className="link" onClick={logoutEvent}>
              Çıkış Yap
            </Link>
          )}
          <img src={MenuIcon} id="menu-icon" onClick={toggleMenuEvent} />
        </div>
      </div>
      {isOpen && (
        <div id="dropdown-menu">
          {!loginSuccess && (
            <Link to="/login" className="link">
              Giriş Yap
            </Link>
          )}
          {loginSuccess && (
            <Link to="/home" className="link">
              {email}
            </Link>
          )}
          {loginSuccess && (
            <Link to="/order-page" className="link">
              Siparişler
            </Link>
          )}
          {loginSuccess && (
            <Link to="/cart-page" className="link">
              Sepetim
            </Link>
          )}
          {loginSuccess && (
            <Link to="#" className="link" onClick={logoutEvent}>
              Çıkış Yap
            </Link>
          )}
        </div>
      )}
    </>
  );
}
