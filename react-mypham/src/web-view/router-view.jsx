import { useRoutes, Navigate } from "react-router-dom";
import Home from "./view-page/home";
import LoginForm from "./view-page/login";
import RegisterForm from "./view-page/register";
import Cart from "./view-page/cart";
import ProductDetail from "./view-page/select-product";
import ProductBrowser from "./view-page/productsBrowser";
import ForgotPassword from "./view-page/forgetPassword";

const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },

    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/register",
      element: <RegisterForm />,
    },
    {
      path: "/select-product/:id",
      element: <ProductDetail />,
    },
    {
      path: "/products/:categoryId",
      element: <ProductBrowser />,
    },
    {
      path: "/products",
      element: <ProductBrowser />,
    },
    {
      path: "/forget-password",
      element: <ForgotPassword />,
    },
    {
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
