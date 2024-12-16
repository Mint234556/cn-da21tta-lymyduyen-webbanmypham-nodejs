import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse, // Đừng quên import Collapse
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People"; // Quản lý người dùng
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Quản lý đơn hàng
import InventoryIcon from "@mui/icons-material/Inventory"; // Quản lý sản phẩm
import GroupIcon from "@mui/icons-material/Group"; // Tương tác người dùng
import ExpandLess from "@mui/icons-material/ExpandLess"; // Import đúng từ đây
import ExpandMore from "@mui/icons-material/ExpandMore"; // Import đúng từ đây
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link, useLocation } from "react-router-dom";

const NavBarUser = () => {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  const [openCategory, setOpenCategory] = useState(false);

  const handleClick = () => {
    setOpenCategory(!openCategory);
  };
  return (
    <>
      {" "}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#fff",
          padding: "30px 20px",
          borderRight: "1px solid #ddd",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "1px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0d1117",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#fff",
          },
        }}
      >
        <Typography
          variant="h6"
          style={{
            marginBottom: "20px",
            color: "#1f1f1f",
          }}
        >
          Quản lý hệ thống
        </Typography>
        <List component="nav">
          <ListItem
            button
            component={Link}
            to="/profile"
            sx={{
              borderRadius: "12px",
              color: "#1f1f1f",
              cursor: "pointer",
              userSelect: "none",
              backgroundColor:
                location.pathname === "/profile" ? "#8aad51" : "transparent", // Kiểm tra nếu đang ở trang này
              "&:hover": { backgroundColor: "#8aad51" },
            }}
          >
            <ListItemIcon>
              {" "}
              <BarChartIcon sx={{ color: "#1f1f1f" }} />
            </ListItemIcon>

            <ListItemText primary="Thông tin" />
          </ListItem>
          {/* //----------------------- */}
          <List>
            {/* Quản lý đơn hàng */}
            <ListItem
              button
              onClick={() => toggleSection("donHang")}
              sx={{
                color: "#1f1f1f",
                borderRadius: "13px",
                cursor: "pointer",
              }}
            >
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: "#1f1f1f" }} />
              </ListItemIcon>
              <ListItemText primary="Quản lý đơn hàng" />
              {openSection === "donHang" ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openSection === "donHang"}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to="/admin/don-hang/dang-xu-ly"
                  sx={{
                    pl: 4,
                    color: "#1f1f1f",
                    mt: 1,
                    mb: 1,
                    borderRadius: "13px",
                    backgroundColor:
                      location.pathname ===
                      "/admin/san-pham/don-hang/dang-xu-ly"
                        ? "#8aad51"
                        : "transparent", // Kiểm tra nếu đang ở trang này
                    "&:hover": {
                      backgroundColor: "#8aad51",
                    },
                  }}
                >
                  <ListItemText primary="Đơn hàng đang xử lý" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/admin/don-hang/tat-ca"
                  sx={{
                    pl: 4,
                    color: "#1f1f1f",
                    mt: 1,
                    mb: 1,
                    borderRadius: "13px",
                    backgroundColor:
                      location.pathname === "/admin/don-hang/tat-ca"
                        ? "#8aad51"
                        : "transparent", // Kiểm tra nếu đang ở trang này
                    "&:hover": {
                      backgroundColor: "#8aad51",
                    },
                  }}
                >
                  <ListItemText primary="Tất cả đơn hàng" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/admin/don-hang/da-giao"
                  sx={{
                    pl: 4,
                    color: "#1f1f1f",
                    mt: 1,
                    mb: 1,
                    borderRadius: "13px",
                    backgroundColor:
                      location.pathname === "/admin/don-hang/tat-ca"
                        ? "#8aad51"
                        : "transparent", // Kiểm tra nếu đang ở trang này
                    "&:hover": {
                      backgroundColor: "#8aad51",
                    },
                  }}
                >
                  <ListItemText primary="Đơn hàng đã giao" />
                </ListItem>{" "}
                <ListItem
                  button
                  component={Link}
                  to="/admin/don-hang/da-huy"
                  sx={{
                    pl: 4,
                    color: "#1f1f1f",
                    mt: 1,
                    mb: 1,
                    borderRadius: "13px",
                    backgroundColor:
                      location.pathname === "/admin/don-hang/tat-ca"
                        ? "#8aad51"
                        : "transparent", // Kiểm tra nếu đang ở trang này
                    "&:hover": {
                      backgroundColor: "#8aad51",
                    },
                  }}
                >
                  <ListItemText primary="Đơn hàng đã hủy" />
                </ListItem>{" "}
                <ListItem
                  button
                  component={Link}
                  to="/admin/thanh-toan/them-thanh-toan"
                  sx={{
                    pl: 4,
                    color: "#1f1f1f",
                    mt: 1,
                    mb: 1,
                    borderRadius: "13px",
                    backgroundColor:
                      location.pathname === "/admin/don-hang/tat-ca"
                        ? "#8aad51"
                        : "transparent", // Kiểm tra nếu đang ở trang này
                    "&:hover": {
                      backgroundColor: "#8aad51",
                    },
                  }}
                >
                  <ListItemText primary="Phương Thức Thanh Toán" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </List>
      </Box>{" "}
    </>
  );
};

export default NavBarUser;
