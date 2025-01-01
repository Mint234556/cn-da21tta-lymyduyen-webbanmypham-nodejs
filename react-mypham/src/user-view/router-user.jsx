import { useRoutes, Navigate } from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import DonHang_DangXuLy_User from "./pages/donHangUser/donHangDangXuLyUser";
import DonHang_DaHuy_User from "./pages/donHangUser/donHangDaHuyUser";
import DonHang_DaThanhToan_User from "./pages/donHangUser/donHangDaThanhToanUser";
import TatCaDonHangUser from "./pages/donHangUser/tatCaDonHangUser";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <UserProfile />,
    },
    {
      path: "/don-hang/dang-xu-ly",
      element: <DonHang_DangXuLy_User />,
    },

    {
      path: "/don-hang/da-huy",
      element: <DonHang_DaHuy_User />,
    },

    {
      path: "/don-hang/da-giao",
      element: <DonHang_DaThanhToan_User />,
    },
    {
      path: "/don-hang/tat-ca",
      element: <TatCaDonHangUser />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
