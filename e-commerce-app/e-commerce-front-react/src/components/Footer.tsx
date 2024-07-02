import IyzicoLogo from "./../images/iyzico_colored.png";
import "./../styles/Footer.css";

export default function Footer() {
  return (
    <div id="footer-con">
      <div id="footer-left">
        <h3>2024 &copy; mehalimes</h3>
      </div>
      <div id="footer-right">
        <img src={IyzicoLogo} id="iyzico-logo" />
      </div>
    </div>
  );
}
