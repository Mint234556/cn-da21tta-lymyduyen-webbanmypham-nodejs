import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ShoppingCart,
  AccountCircle,
  Phone,
  Storefront,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logo/favicon.png";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice"; // Action từ Redux slice
import Cookies from "js-cookie";
import axios from "axios";
const Header = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const api = process.env.REACT_APP_URL_SERVER;
  const navigate = useNavigate();
  // Mở menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Gọi API để clear session trên backend
      await axios.post(`${api}/logout`);

      // Clear cookies và Redux state
      Cookies.remove("accessToken");
      dispatch(logout());

      // Điều hướng về trang đăng nhập
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#8aad51" }}>
      <Toolbar>
        {/* Left section: Logo and other items */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              marginRight: 2,
              color: "white",
              textDecoration: "none",
            }}
          >
            <img
              src={`https://image.cocoonvietnam.com/uploads/vegan_society_41cc2b390a.svg`}
              alt="PNJ"
              style={{ width: "40px", marginTop: "10px" }}
            />
          </Typography>
          <Button sx={{ color: "white" }}>Quan Hệ Cổ Đông (IR)</Button>
          <Button sx={{ color: "white" }}>Cửa Hàng</Button>
        </Box>

        {/* Middle section: Phone number */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Phone sx={{ color: "white", marginRight: 1 }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            1800 54 54 57
          </Typography>
        </Box>

        {/* Right section: User and Cart */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {userInfo ? (
            <>
              <Button
                variant="text"
                sx={{ padding: 2, color: "#fff" }}
                onClick={handleMenuOpen}
              >
                <AccountCircle />
                <Typography variant="body2" sx={{ ml: 2, color: "white" }}>
                  {userInfo.TENNGUOIDUNG || "Người dùng"}
                </Typography>
              </Button>
              {/* Menu các tùy chọn */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                {/* Option: Thông tin cá nhân */}
                <MenuItem onClick={() => alert("Hiển thị thông tin cá nhân")}>
                  Thông tin cá nhân
                </MenuItem>

                {/* Option: Đăng xuất */}
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {" "}
              <IconButton
                component={Link} // Sử dụng Link làm component
                to="/login" // Đường dẫn đến trang tài khoản
                sx={{
                  color: "white",
                  textDecoration: "none", // Xóa underline mặc định của Link
                }}
              >
                <AccountCircle />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Đăng nhập
                </Typography>
              </IconButton>
            </>
          )}

          <IconButton
            component={Link} // Sử dụng Link làm component
            to="/cart" // Đường dẫn đến trang tài khoản
            sx={{
              color: "white",
              textDecoration: "none", // Xóa underline mặc định của Link
            }}
          >
            <Storefront />
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              Giỏ Hàng
            </Typography>
            <Badge badgeContent={0} color="error" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
