import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Button,
} from "@mui/material";
import {
  ShoppingCart,
  AccountCircle,
  Phone,
  Storefront,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../../public/logo/favicon.png";
const Header = () => {
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
