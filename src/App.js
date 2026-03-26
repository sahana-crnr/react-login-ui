import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes (Only accessible if NOT logged in) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  );
}

export default App;
