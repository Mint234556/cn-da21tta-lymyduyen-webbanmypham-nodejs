import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Rating,
  Stack,
} from "@mui/material";

import img1 from "../../public/list-product/product-1.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductGrid = ({ apiURL, title }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const api = process.env.REACT_APP_URL_SERVER;
  useEffect(() => {
    fetchProducts();
  }, []);
  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiURL}`);
      setProducts(response.data.DT);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        Không có sản phẩm nào để hiển thị.
      </Typography>
    );
  }

  const handleMoveSelectProducts = (id) => {
    navigate(`/select-product/${id}`);
  };

  return (
    <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Thêm chiều dọc để căn giữa nội dung
          justifyContent: "center",
          alignItems: "center", // Căn giữa theo chiều ngang
          mb: 2,
          width: "80%", // Đảm bảo phần tử con có đủ không gian để căn giữa
        }}
      >
        {" "}
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {" "}
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            width: "100%", // Đảm bảo có chiều rộng cho phần tử con
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}></Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate("/products")}
          >
            Xem thêm &gt;
          </Button>
        </Box>
        <Grid container spacing={2} justifyContent="center">
          {" "}
          {/* Căn giữa các items trong Grid */}
          {products.slice(0, 8).map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.MASANPHAM}>
              <Card
                sx={{ width: "90%" }}
                onClick={() => handleMoveSelectProducts(product.MASANPHAM)}
              >
                {/* Hiển thị hình ảnh sản phẩm */}
                <CardMedia
                  component="img"
                  height="160"
                  image={`${api}/images/${product.HINHANHSANPHAM}`} // Đường dẫn ảnh sản phẩm
                  alt={product.TENSANPHAM} // Tên sản phẩm làm thuộc tính alt
                />

                <CardContent>
                  {/* Tên sản phẩm */}
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {product.TENSANPHAM}
                  </Typography>

                  {/* Giá sản phẩm */}
                  <Typography variant="h6" color="error">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.GIA)}
                  </Typography>

                  {/* Số lượng còn lại */}
                  <Typography variant="body2" color="textSecondary">
                    Số lượng: {product.SOLUONG}
                  </Typography>

                  {/* Trạng thái sản phẩm */}
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        product.TRANGTHAISANPHAM === "Đang hoạt động"
                          ? "green"
                          : "red",
                    }}
                  >
                    {product.TRANGTHAISANPHAM}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductGrid;
