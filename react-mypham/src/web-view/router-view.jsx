import { useRoutes, Navigate } from "react-router-dom";
import Home from "./view-page/home";

const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },

    // {
    //   path: "/home",
    //   element: <Home />,
    // },
    {
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
