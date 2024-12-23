import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Button,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setTotalCart } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); // Get userId from localStorage
  const api = process.env.REACT_APP_URL_SERVER;
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      enqueueSnackbar("Vui lòng đăng nhập để tiếp tục!", { variant: "info" });
    } else {
      fetchCartItems();
    }
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${api}/gio-hang/use/cart-user/${userInfo.MANGUOIDUNG}`
      );
      if (response.data.EC === 1) {
        setCartItems(response.data.DT);
      }
    } catch (error) {
      enqueueSnackbar("Lỗi khi tải giỏ hàng", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      if (action === "add") {
        await axios.post(`${api}/gio-hang/add-single`, {
          userId: userInfo.MANGUOIDUNG,
          productId,
        });
      } else {
        await axios.post(`${api}/gio-hang/remove-single`, {
          userId: userInfo.MANGUOIDUNG,
          productId,
        });
      }
      fetchCartItems();
    } catch (error) {
      enqueueSnackbar("Lỗi khi cập nhật số lượng", { variant: "error" });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item.MAGIOHANG} sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={`${api}/images/${item.HINHANHSANPHAM}`}
                    alt={item.TENSANPHAM}
                    sx={{ objectFit: "contain" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">{item.TENSANPHAM}</Typography>
                  <Typography color="textSecondary">
                    {item.TENLOAISANPHAM}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.GIA)}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      onClick={() => updateQuantity(item.MASANPHAM, "remove")}
                      disabled={item.SOLUONG_GIOHANG <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.SOLUONG_GIOHANG}</Typography>
                    <IconButton
                      onClick={() => updateQuantity(item.MASANPHAM, "add")}
                      disabled={item.SOLUONG_GIOHANG >= item.SOLUONG_KHO}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tổng đơn hàng
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Tổng số lượng:</Typography>
              <Typography>{cartItems.length} sản phẩm</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Thành tiền:</Typography>
              <Typography fontWeight="bold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  cartItems.reduce(
                    (total, item) => total + item.GIA * item.SOLUONG_GIOHANG,
                    0
                  )
                )}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#ad1457",
                "&:hover": { backgroundColor: "#880e4f" },
              }}
            >
              Tiến hành thanh toán
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart;
