import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const ProductDetail = () => {
  return (
    <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
      {/* Header with back button */}
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <IconButton sx={{ color: "#000" }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
          Serum Dưỡng Da Vitamin C
        </Typography>
        <Box />
      </Grid>

      {/* Main content: Image on left and Product info on right */}
      <Grid container spacing={3}>
        {/* Product Image on the left */}
        <Grid item xs={12} md={6}>
          <Card sx={{ maxWidth: 400 }}>
            <CardMedia
              component="img"
              image="https://via.placeholder.com/400x400" // Bạn có thể thay URL này bằng ảnh thật
              alt="Serum Dưỡng Da Vitamin C"
            />
          </Card>
        </Grid>

        {/* Product Info on the right */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ color: "#d32f2f", marginBottom: 2 }}>
            650.000 ₫
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#757575", marginBottom: 2 }}
          >
            Giá sản phẩm (Giá có thể thay đổi theo các chương trình khuyến mãi)
          </Typography>

          {/* Product Size Selection */}
          <TextField
            label="Chọn dung tích"
            select
            fullWidth
            sx={{ marginBottom: 2, borderColor: "#d32f2f" }}
            defaultValue={30}
            SelectProps={{
              native: true,
            }}
          >
            {[30, 50, 100].map((size) => (
              <option value={size} key={size}>
                {size} ml
              </option>
            ))}
          </TextField>

          {/* Product Description */}
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            Serum dưỡng da Vitamin C giúp làm sáng da, cải thiện làn da không
            đều màu, đồng thời giảm thiểu sự xuất hiện của các đốm nâu và nếp
            nhăn.
          </Typography>

          {/* Special Offers */}
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="h6" sx={{ color: "#d32f2f", marginBottom: 2 }}>
            Ưu đãi đặc biệt:
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Giảm 150.000 VNĐ cho đơn hàng từ 1 triệu VNĐ khi thanh toán qua
            VBank hoặc Payoo.
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Giảm 50.000 VNĐ cho đơn hàng từ 500k khi thanh toán qua ví Momo.
          </Typography>

          {/* Add to Cart and Buy Now Buttons */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#d32f2f",
                  "&:hover": {
                    backgroundColor: "#9a0007",
                  },
                }}
              >
                Thêm vào giỏ hàng
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#0d47a1",
                  },
                }}
              >
                Mua ngay
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Footer with Store Info */}
      <Divider sx={{ marginBottom: 2 }} />
      <Typography variant="body2" align="center">
        Xem cửa hàng trên{" "}
        <Link href="#" color="primary">
          BeautyStore
        </Link>
      </Typography>
    </Box>
  );
};

export default ProductDetail;
