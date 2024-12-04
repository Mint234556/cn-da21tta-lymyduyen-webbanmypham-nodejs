import { useRoutes, Navigate } from "react-router-dom";

// import UserProfile from "./pages/DashboardUser";

const UserRouter = () => {
  const element = useRoutes([
    // {
    //   path: "/",
    //   element: <UserProfile />,
    // },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
