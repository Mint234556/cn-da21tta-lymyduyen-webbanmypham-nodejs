import React from "react";
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

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      image: img1,
      title: "Son Môi Lì 2 In 1",
      price: "350.000đ",
      rating: 5,
      sold: "2000+ đã bán",
      installment: "0% Trả góp",
    },
    {
      id: 2,
      image: img1,
      title: "Kem Dưỡng Da Ban Đêm",
      price: "450.000đ",
      rating: 4,
      sold: "2000+ đã bán",
      installment: "0% Trả góp",
    },
    {
      id: 3,
      image: img1,
      title: "Phấn Nền BB Cream",
      price: "390.000đ",
      rating: 4,
      sold: "2000+ đã bán",
      installment: "0% Trả góp",
    },
    {
      id: 4,
      image: img1,
      title: "Kem Dưỡng Mắt Ban Ngày",
      price: "350.000đ",
      rating: 4,
      sold: "2000+ đã bán",
      installment: "0% Trả góp",
    },
    {
      id: 5,
      image: img1,
      title: "Sữa Rửa Mặt Dành Cho Da Nhạy Cảm",
      price: "250.000đ",
      rating: 4,
      sold: "2000+ đã bán",
      installment: "0% Trả góp",
    },
    {
      id: 6,
      image: img1,
      title: "Mặt Nạ Dưỡng Ẩm",
      price: "180.000đ",
      rating: 4,
      sold: "2000+ đã bán",
      installment: "0% Trả góp",
    },
    {
      id: 7,
      image: img1,
      title: "Nước Hoa Hương Thơm Dịu Nhẹ",
      price: "800.000đ",
      rating: 4,
      sold: "2000+ đã bán",
      installment: "0% Trả góp",
    },
    {
      id: 8,
      image: img1,
      title: "Kem Chống Nắng SPF50+",
      price: "450.000đ",
      rating: 4,
      sold: "2000+ đã bán",
      installment: "0% Trả góp",
    },
    // Thêm sản phẩm khác theo định dạng này
  ];

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        Không có sản phẩm nào để hiển thị.
      </Typography>
    );
  }
  return (
    <Box sx={{ my: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}></Typography>
        <Button variant="text" size="small">
          Xem thêm &gt;
        </Button>
      </Box>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.title}
              />
              <CardContent>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {product.title}
                </Typography>
                <Typography variant="h6" color="error">
                  {product.price}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <Rating value={product.rating} readOnly size="small" />
                  <Typography variant="body2" color="textSecondary">
                    ({product.rating})
                  </Typography>
                </Stack>
                <Typography variant="body2" color="textSecondary">
                  {product.sold}
                </Typography>
                <Typography variant="body2" color="primary">
                  {product.installment}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
