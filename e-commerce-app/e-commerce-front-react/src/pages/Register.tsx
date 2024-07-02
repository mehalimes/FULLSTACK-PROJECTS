import Input from "../components/Input";
import Button from "../components/Button";
import { useAppSelector } from "../hooks";
import "./../styles/Register.css";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const email: string = useAppSelector((state) => state.app.email);
    const password: string = useAppSelector((state) => state.app.password);

    let endpoint: string = process.env.REACT_APP_API_ENDPOINT!;
    let serviceID: string = process.env.REACT_APP_EMAILJS_SERVICE_ID!;
    let templateID: string = process.env.REACT_APP_EMAILJS_TEMPLATE_ID!;
    let publicKey: string = process.env.REACT_APP_EMAILJS_PUBLIC_KEY!;

    const navigate = useNavigate();

    const registerEvent = () => {
        axios
            .post((endpoint + "/register").toString(), {
                email: email,
                password: password,
            })
            .then((res) => {
                const templateParams = {
                    to_email: email,
                    verify_link:
                        endpoint +
                        "/verifyToken?email=" +
                        email +
                        "&token=" +
                        encodeURIComponent(res.data),
                };

                emailjs
                    .send(serviceID, templateID, templateParams, publicKey)
                    .then((secondRes) => {
                        if (secondRes.status === 200) {
                            alert("Verify Link Sent To Your Email.");
                            navigate("/login");
                        }
                    })
                    .catch((secondErr) => {
                        console.log(secondErr);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div id="register-con">
            <div id="register-sub-con">
                <h2>REGISTER</h2>
                <Input variable="email" type="text" placeholder="Email" />
                <Input variable="password" type="password" placeholder="Password" />
                <Button name="Register" width={130} height={40} Event={registerEvent} />
            </div>
        </div>
    );
}
