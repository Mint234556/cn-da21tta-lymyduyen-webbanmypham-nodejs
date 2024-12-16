import { useRoutes, Navigate } from "react-router-dom";
import DashboardAdmin from "./pages/DashboardAdmin";
import ProductManager from "./pages/sanPhamAdmin.jsx/page/sanPhamAdmin";
import CategoryCRUD from "./pages/sanPhamAdmin.jsx/page/categoryAdmin";
import UserManagement from "./pages/nguoiDungAdmin/page/nguoiDungAdmin";

const RouterAdmin = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <DashboardAdmin />,
    },
    {
      path: "/san-pham",
      element: <ProductManager />,
    },
    {
      path: "/nguoi-dung",
      element: <UserManagement />,
    },
    {
      path: "/san-pham/danh-muc",
      element: <CategoryCRUD />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />, // Chuyển hướng nếu không tìm thấy route
    },
  ]);

  return element;
};

export default RouterAdmin;
