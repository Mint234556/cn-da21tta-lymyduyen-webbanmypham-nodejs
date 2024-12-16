import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/danh-muc/use`);
      if (response.data.EC === 1) {
        setCategories(response.data.DT);
      }
    } catch (error) {}
  };

  const [searchTerm, setSearchTerm] = useState(""); // Lưu giá trị tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // Lưu kết quả tìm kiếm
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  // Hàm xử lý tìm kiếm
  const fetchSearchResults = async (term) => {
    if (!term.trim()) {
      setSearchResults([]); // Nếu từ khóa rỗng, xóa kết quả
      return;
    }

    setIsLoading(true); // Bắt đầu loading
    try {
      const response = await axios.get(`${api}/san-pham/search`, {
        params: { query: term },
      });
      if (response.data.EC === 1) {
        setSearchResults(response.data.DT); // Cập nhật danh sách kết quả
      } else {
        setSearchResults([]); // Không có kết quả
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]); // Lỗi thì không hiển thị kết quả
    }
    setIsLoading(false); // Kết thúc loading
  };

  // Xử lý khi người dùng nhập
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Cập nhật từ khóa tìm kiếm
    fetchSearchResults(value); // Gọi API tìm kiếm
  };

  const handleMoveSelectProducts = (id) => {
    setSearchResults([]);
    setSearchTerm(null);
    navigate(`/select-product/${id}`);
  };
  const handleCategoryClick = (category) => {
    navigate(`/products/${category.MALOAISANPHAM}`, { state: category }); // Chuyển hướng và truyền categoryId
  };
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
          {categories.map((category) => (
            <Button
              onClick={() => handleCategoryClick(category)}
              key={category.ID} // Đảm bảo key duy nhất cho mỗi nút
              sx={{
                color:
                  category.TENLOAISANPHAM === "Khuyến Mãi"
                    ? "#D32F2F"
                    : "black",
                fontSize: "16px",
              }}
            >
              {category.TENLOAISANPHAM}
            </Button>
          ))}
        </Box>

        {/* Right section: Search bar */}
        <Box
          sx={{ display: "flex", alignItems: "center", position: "relative" }}
        >
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm mỹ phẩm"
            size="small"
            value={searchTerm}
            onChange={handleChange} // Thay đổi giá trị khi nhập
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              width: "250px",
              marginRight: 2,
            }}
          />
          <IconButton sx={{ color: "black" }}>
            <SearchIcon />
          </IconButton>

          {/* Hiển thị kết quả */}
          {isLoading ? (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "250px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                zIndex: 10,
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              Đang tìm kiếm...
            </Box>
          ) : (
            searchResults.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "250px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  zIndex: 10,
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                <List>
                  {searchResults.map((item) => (
                    <ListItem key={item.ID} button>
                      <ListItemText
                        onClick={() => handleMoveSelectProducts(item.MASANPHAM)}
                        sx={{ color: "#000" }}
                        primary={item.TENSANPHAM}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
