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
  TextField,
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
      // const response_KhuyenMai = await axios.get(
      //   `${api}/gio-hang/use/cart-user/${userInfo.MANGUOIDUNG}`
      // );
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

  const [code, setCode] = useState(""); // Lưu mã giảm giá nhập vào
  const [khuyenMai, setKhuyenMai] = useState(null); // Lưu dữ liệu khuyến mãi
  useEffect(() => {
    const calculatedTotal =
      cartItems.reduce(
        (total, item) => total + item.GIA * item.SOLUONG_GIOHANG,
        0
      ) - (khuyenMai?.SOTIENGIAM || 0);

    setTotalPrice(calculatedTotal); // Cập nhật giá trị vào state
  }, [cartItems, khuyenMai]); // Theo dõi thay đổi của cartItems và khuyenMai
  // Xử lý khi người dùng nhập mã giảm giá và tìm kiếm
  const handleSearch = async () => {
    if (!code) return;

    setLoading(true);

    try {
      const response = await axios.get(`${api}/khuyen-mai/${code}`); // Gọi API để tìm khuyến mãi theo mã
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        setKhuyenMai(response.data.DT); // Cập nhật khuyến mãi
      } else {
        enqueueSnackbar(response.data.EM, { variant: "info" });
      }
    } catch (err) {
      enqueueSnackbar(err.response.data.EM, { variant: "info" });
    } finally {
      setLoading(false); // Kết thúc quá trình loading
    }
  };

  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [addressUser, setAddressUser] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const handleSummitThanhToan = async () => {
    if (!addressUser || addressUser === "") {
      enqueueSnackbar("Vui lòng nhập địa chỉ của bạn !!", { variant: "info" });
      return;
    }

    const requestData = {
      idNguoiDung: userInfo.MANGUOIDUNG,
      hinhThucThanhToan: "Thanh toán tại nhà",
      maKhuyenMai: khuyenMai?.MAKHUYENMAI || false,
      tongTien: totalPrice < 0 ? totalPrice : totalPrice,
      trangThaiDonHang: "Đang chờ thanh toán",
      items: cartItems,
      email: userInfo.EMAIL,
      DIA_CHI_DON_HANG: addressUser,
    };

    try {
      const response = await axios.post(`${api}/don-hang`, requestData);
      if (response.data.EC == 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        fetchCartItems();
      } else {
        enqueueSnackbar(response.data.EM || "Đã có lỗi xảy ra!", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      enqueueSnackbar("Lỗi hệ thống, vui lòng thử lại sau!", {
        variant: "error",
      });
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
        {isOpenAddress ? (
          <>
            {" "}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                {" "}
                <Typography variant="h6" gutterBottom>
                  Tổng đơn hàng
                </Typography>
                <Divider sx={{ my: 2 }} />{" "}
                <TextField
                  margin="dense"
                  label="Mã giảm giá"
                  name="CODE"
                  value={code} // Hiển thị giá trị trong ô input
                  onChange={(e) => setCode(e.target.value)} // Cập nhật giá trị khi người dùng nhập
                  fullWidth
                />
                <Button
                  onClick={handleSearch}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Áp dụng
                </Button>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={2}
                  mt={2}
                >
                  {" "}
                  <Typography>Tổng số lượng:</Typography>
                  <Typography>{cartItems.length} loại sản phẩm</Typography>
                </Box>{" "}
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Tiền sản phẩm</Typography>
                  <Typography fontWeight="bold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      cartItems.reduce(
                        (total, item) =>
                          total + item.GIA * item.SOLUONG_GIOHANG,
                        0
                      )
                    )}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Số tiền giảm</Typography>
                  <Typography fontWeight="bold">
                    {khuyenMai?.MOTA === "Chưa được sử dụng" ? (
                      <>
                        {" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(khuyenMai.SOTIENGIAM)}
                      </>
                    ) : (
                      <>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(0)}
                      </>
                    )}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Thành tiền:</Typography>
                  <Typography fontWeight="bold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      Math.max(
                        cartItems.reduce(
                          (total, item) =>
                            total + item.GIA * item.SOLUONG_GIOHANG,
                          0
                        ) - (khuyenMai?.SOTIENGIAM || 0),
                        0 // Đảm bảo không bị âm
                      )
                    )}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setIsOpenAddress(false)}
                  sx={{
                    mt: 2,
                    backgroundColor: "#ad1457",
                    "&:hover": { backgroundColor: "#880e4f" },
                  }}
                >
                  Nhập địa chỉ
                </Button>
              </Card>
            </Grid>
          </>
        ) : (
          <>
            {" "}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                {" "}
                <Typography variant="h6" gutterBottom>
                  Tổng đơn hàng
                </Typography>
                <Divider sx={{ my: 2 }} />{" "}
                <TextField
                  margin="dense"
                  label="Địa chỉ của bạn"
                  name="DIACHI"
                  value={addressUser} // Hiển thị giá trị trong ô input
                  onChange={(e) => setAddressUser(e.target.value)} // Cập nhật giá trị khi người dùng nhập
                  fullWidth
                />
                {userInfo?.DIACHI ? (
                  <>
                    {" "}
                    <Button
                      onClick={() => setAddressUser(userInfo.DIACHI)}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Dùng địa chỉ tài khoản
                    </Button>
                  </>
                ) : (
                  false
                )}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={2}
                  mt={2}
                >
                  {" "}
                  <Typography>Tổng số lượng:</Typography>
                  <Typography>{cartItems.length} loại sản phẩm</Typography>
                </Box>{" "}
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Thành tiền:</Typography>
                  <Typography fontWeight="bold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      Math.max(
                        cartItems.reduce(
                          (total, item) =>
                            total + item.GIA * item.SOLUONG_GIOHANG,
                          0
                        ) - (khuyenMai?.SOTIENGIAM || 0),
                        0 // Đảm bảo không bị âm
                      )
                    )}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setIsOpenAddress(true)}
                    sx={{
                      width: "48%",
                      mt: 2,
                      backgroundColor: "#ad1457",
                      "&:hover": { backgroundColor: "#880e4f" },
                    }}
                  >
                    Quay về
                  </Button>{" "}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSummitThanhToan}
                    sx={{
                      width: "48%",
                      mt: 2,
                      backgroundColor: "#28a745",
                      "&:hover": { backgroundColor: "#1b742f" },
                    }}
                  >
                    Mua hàng
                  </Button>{" "}
                </Box>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Cart;
