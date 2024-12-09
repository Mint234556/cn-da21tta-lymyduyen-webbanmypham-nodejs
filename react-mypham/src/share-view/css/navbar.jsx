import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#f8f8f8", // Màu nền nhẹ nhàng
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        {/* Left section: Navbar buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button sx={{ color: "black", fontSize: "16px" }}>Son Môi</Button>
          <Button sx={{ color: "black", fontSize: "16px" }}>
            Kem Dưỡng Da
          </Button>
          <Button sx={{ color: "black", fontSize: "16px" }}>Mặt Nạ</Button>
          <Button sx={{ color: "black", fontSize: "16px" }}>Nước Hoa</Button>
          <Button sx={{ color: "black", fontSize: "16px" }}>Chăm Sóc Da</Button>
          <Button sx={{ color: "black", fontSize: "16px" }}>Trang Điểm</Button>
          <Button sx={{ color: "#D32F2F", fontSize: "16px" }}>
            Khuyến Mãi
          </Button>
        </Box>

        {/* Right section: Search bar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm mỹ phẩm"
            size="small"
            sx={{
              backgroundColor: "#ffffff", // Màu nền sáng
              borderRadius: "20px",
              width: "250px",
              marginRight: 2,
            }}
          />
          <IconButton sx={{ color: "black" }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
