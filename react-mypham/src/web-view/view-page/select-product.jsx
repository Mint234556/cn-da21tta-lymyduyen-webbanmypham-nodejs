import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setTotalCart } from "../../redux/authSlice";
const ProductDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState({});
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const api = process.env.REACT_APP_URL_SERVER;
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetchProductsByID();
    }
  }, [id]);

  // Fetch product by ID
  const fetchProductsByID = async () => {
    try {
      const response = await axios.get(`${api}/san-pham/use/${id}`);
      setProducts(response.data.DT); // Lưu dữ liệu sản phẩm vào state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  // THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async (isToCart) => {
    if (!isAuthenticated) {
      enqueueSnackbar("Vui lòng đăng nhập để tiếp tục!");
      navigate("/login"); // Đảm bảo '/login' là đường dẫn đúng tới trang đăng nhập của bạn
      return; // Dừng hàm nếu chưa đăng nhập
    }

    try {
      const payload = {
        ID_SAN_PHAM: id,
        ID_NGUOI_DUNG: userInfo.MANGUOIDUNG, // ID người dùng
        NGAY_CAP_NHAT_GIOHANG: new Date().toISOString(),
      };

      const response = await axios.post(`${api}/gio-hang/`, payload);

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        dispatch(setTotalCart(response.data.totalQuantity));
      } else {
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      enqueueSnackbar(error.response.data.EM, { variant: "error" });
    } finally {
      if (isToCart) {
        navigate("/cart");
      }
    }
  };
  // Hàm xử lý quay lại
  const handleBack = () => {
    navigate(-1); // Điều hướng về route trước
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
      {/* Header with back button */}
      <Grid container justifyContent="left" alignItems="center" mb={3}>
        <IconButton sx={{ color: "#000" }} onClick={handleBack}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
          {products.TENSANPHAM || "Sản phẩm không tìm thấy"}
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
              image={
                products.HINHANHSANPHAM
                  ? `${api}/images/${products.HINHANHSANPHAM}`
                  : "https://via.placeholder.com/400x400"
              }
              alt={products.TENSANPHAM || "Sản phẩm không có tên"}
            />
          </Card>
        </Grid>

        {/* Product Info on the right */}
        <Grid item xs={12} md={6}>
          {/* Product Price */}
          <Typography variant="h5" sx={{ color: "#d32f2f", marginBottom: 2 }}>
            {products.GIA ? `${products.GIA} ₫` : "Giá sản phẩm"}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#757575", marginBottom: 2 }}
          >
            Giá sản phẩm (Giá có thể thay đổi theo ưu đãi)
          </Typography>

          {/* Product Quantity */}
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Số lượng: {products.SOLUONG || "Không có thông tin"}
          </Typography>

          {/* Product Description */}
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            {products.MOTA || "Mô tả sản phẩm chưa có"}
          </Typography>

          {/* Product Status */}
          <Typography
            variant="body2"
            sx={{ marginBottom: 2, color: "#757575" }}
          >
            Trạng thái:{" "}
            {products.TRANGTHAISANPHAM || "Không có thông tin trạng thái"}
          </Typography>

          {/* Category Info */}
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="h6" sx={{ color: "#1976d2", marginBottom: 2 }}>
            Thông tin danh mục:
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Mã loại sản phẩm: {products.MALOAISANPHAM || "Không có thông tin"}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Tên loại sản phẩm: {products.TENLOAISANPHAM || "Không có thông tin"}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Mô tả danh mục: {products.MOTA || "Không có thông tin"}
          </Typography>

          {/* Buttons */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={() => handleAddToCart(false)}
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
                onClick={() => handleAddToCart(true)}
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

      {/* Footer */}
      <Divider sx={{ marginBottom: 2 }} />
      <Typography variant="body2" align="center">
        Xem thêm sản phẩm tại{" "}
        <Link href="#" color="primary">
          Mỹ phẩm shop
        </Link>
      </Typography>
    </Box>
  );
};

export default ProductDetail;
