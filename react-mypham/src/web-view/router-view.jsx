import { useRoutes, Navigate } from "react-router-dom";
import Home from "./view-page/home";
import LoginForm from "./view-page/login";
import RegisterForm from "./view-page/register";
import Cart from "./view-page/cart";
import ProductDetail from "./view-page/select-product";

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
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
