import { useRoutes, Navigate } from "react-router-dom";

import ProductManager from "./pages/sanPhamAdmin.jsx/page/sanPhamAdmin";
import CategoryCRUD from "./pages/sanPhamAdmin.jsx/page/categoryAdmin";
import UserManagement from "./pages/nguoiDungAdmin/page/nguoiDungAdmin";
import KhuyenMaiCRUD from "./pages/thanhToanAdmin.jsx/khuyenMai";
import DashboardAdmin from "./pages/DashboardAdmin";
import TatCaDonHangAdmin from "./pages/donHangAdmin/tatCaDonHangAdmin";
import DonHang_DaHuy_Admin from "./pages/donHangAdmin/donHangDaHuyAdmin";
import DonHang_DangXuLy_Admin from "./pages/donHangAdmin/donHangDangXuLyAdmin";
import DonHang_DaThanhToan_Admin from "./pages/donHangAdmin/donHangDaThanhToan";

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
      path: "/khuyen-mai",
      element: <KhuyenMaiCRUD />,
    },
    {
      path: "/san-pham/danh-muc",
      element: <CategoryCRUD />,
    },

    {
      path: "/don-hang/tat-ca",
      element: <TatCaDonHangAdmin />,
    },
    {
      path: "/don-hang/da-huy",
      element: <DonHang_DaHuy_Admin />,
    },
    {
      path: "/don-hang/dang-xu-ly",
      element: <DonHang_DangXuLy_Admin />,
    },
    {
      path: "/don-hang/hoan-tat",
      element: <DonHang_DaThanhToan_Admin />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />, // Chuyển hướng nếu không tìm thấy route
    },
  ]);

  return element;
};

export default RouterAdmin;
