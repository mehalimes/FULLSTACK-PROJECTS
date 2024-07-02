import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductPage from "./pages/ProductPage";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminPanel from "./pages/AdminPanel";
import AddProductPanel from "./pages/AddProductPanel";
import "./App.css";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product-page/:ID" element={<ProductPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/add-product" element={<AddProductPanel />} />
        <Route path="/cart-page" element={<CartPage />} />
        <Route path="/order-page" element={<OrderPage />} />
        <Route path="/payment-page" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
