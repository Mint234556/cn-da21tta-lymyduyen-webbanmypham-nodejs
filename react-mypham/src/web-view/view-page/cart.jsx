import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const Cart = () => {
  const products = [
    {
      id: "PM001",
      name: "Son môi dưỡng ẩm A Beauty",
      price: 350000,
      quantity: 1,
      imageUrl: "https://via.placeholder.com/100", // Thay đổi URL ảnh mỹ phẩm thật
    },
    {
      id: "PM002",
      name: "Kem dưỡng ẩm ban đêm A Beauty",
      price: 550000,
      quantity: 1,
      imageUrl: "https://via.placeholder.com/100", // Thay đổi URL ảnh mỹ phẩm thật
    },
  ];

  const [cartItems, setCartItems] = useState(products);
  const [totalPrice, setTotalPrice] = useState(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  const handleBack = () => {
    // Chuyển hướng về trang trước (trang chủ hoặc trang khác)
    window.history.back();
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: 3,
        backgroundColor: "#8aad51",
      }}
    >
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <IconButton onClick={handleBack} sx={{ color: "#ad1457" }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" align="center" sx={{ color: "#ad1457" }}>
          Giỏ Hàng Mỹ Phẩm
        </Typography>
        <Box />
      </Grid>

      {/* Giỏ hàng thông tin */}
      <Typography variant="body1" color="textSecondary" mb={2}>
        Tất cả ({cartItems.length} sản phẩm)
      </Typography>

      {/* Sản phẩm */}
      {cartItems.map((item, index) => (
        <Card
          key={index}
          sx={{
            display: "flex",
            marginBottom: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 100, borderRadius: 1 }}
            image={item.imageUrl}
            alt={item.name}
          />
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: "#ad1457" }}
              >
                {item.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Mã sản phẩm: {item.id}
              </Typography>
              <Typography variant="body2" mt={1} sx={{ color: "#ad1457" }}>
                {item.quantity} x {item.price.toLocaleString()} ₫
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ))}

      {/* Tính tổng tiền */}
      <Divider sx={{ marginBottom: 2 }} />
      <Box sx={{ textAlign: "right", marginBottom: 2 }}>
        <Typography variant="body1" fontWeight="bold" sx={{ color: "#ad1457" }}>
          Tạm tính: {totalPrice.toLocaleString()} ₫
        </Typography>
        <Typography variant="body1" color="green">
          Giảm giá: - 0 ₫
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          mt={1}
          sx={{ color: "#ad1457" }}
        >
          Tổng tiền: {totalPrice.toLocaleString()} ₫
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          (Giá tham khảo đã bao gồm VAT)
        </Typography>
      </Box>

      {/* Nút Tiếp tục */}
      <Box mt={2}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{
            backgroundColor: "#ad1457",
            "&:hover": { backgroundColor: "#880e4f" },
          }}
        >
          Tiếp tục
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
