import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Modal,
  Box,
  Grid,
} from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const DonHang_DaHuy_User = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // Lấy danh sách đơn hàng khi component được mount
  useEffect(() => {
    if (userInfo) {
      fetchOrders();
    } else {
      navigate("/login");
    }
  }, []);
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${api}/don-hang/da-huy/${userInfo.MANGUOIDUNG}`
      ); // Đảm bảo URL đúng với API của bạn
      setOrders(response.data.DT);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Mở modal xem chi tiết đơn hàng
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };
  const handleUpdateStatusSuccess = async (orderId) => {
    try {
      // Gửi yêu cầu cập nhật trạng thái "Giao dịch thành công"
      const response = await axios.put(`${api}/don-hang/${orderId}/success`);

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM);
      } else {
        enqueueSnackbar(response.data.EM);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      enqueueSnackbar(err.response.data.EM);
    } finally {
      fetchOrders();
    }
  };

  const handleUpdateStatusCanceled = async (orderId) => {
    try {
      // Gửi yêu cầu cập nhật trạng thái "Đã hủy"
      const response = await axios.put(`${api}/don-hang/${orderId}/canceled`);

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM); // Thông báo thành công
      } else {
        enqueueSnackbar(response.data.EM); // Thông báo lỗi
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      enqueueSnackbar("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
    } finally {
      fetchOrders();
    }
  };
  return (
    <div>
      <Typography variant="h4" gutterBottom mt={2}>
        Đơn hàng đã hủy
      </Typography>

      {/* Hiển thị danh sách đơn hàng */}
      {orders.map((order) => (
        <Card key={order.MADONHANG} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">Đơn hàng #{order.MADONHANG}</Typography>
            <Typography variant="body2">
              Người dùng: {order.TENNGUOIDUNG}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color:
                  order.TRANGTHAI === "Giao dịch thành công"
                    ? "#4ca944"
                    : order.TRANGTHAI === "Đã hủy"
                    ? "#c6463f"
                    : "#cca70b",
              }}
            >
              Trạng thái: {order.TRANGTHAI}
            </Typography>
            <Typography variant="body2">
              Tổng tiền:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.TONGTIEN)}
            </Typography>

            <Button
              onClick={() => handleOpenModal(order)}
              variant="outlined"
              sx={{ marginTop: 1 }}
            >
              Xem chi tiết
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Modal hiển thị chi tiết đơn hàng */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          {selectedOrder && (
            <div>
              <Typography variant="h5" gutterBottom>
                Chi Tiết Đơn Hàng #{selectedOrder.MADONHANG}
              </Typography>

              <Typography variant="h6">Thông tin người dùng:</Typography>
              <Typography variant="body1">
                Tên: {selectedOrder.TENNGUOIDUNG}
              </Typography>
              <Typography variant="body1">
                Email: {selectedOrder.EMAIL}
              </Typography>
              <Typography variant="body1">
                SĐT: {selectedOrder.SODIENTHOAI}
              </Typography>
              <Typography variant="body1">
                Địa chỉ: {selectedOrder.DIACHI}
              </Typography>

              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Sản phẩm trong đơn hàng:
              </Typography>
              <Grid container spacing={2}>
                {/* Duyệt qua các sản phẩm trong đơn hàng */}
                {selectedOrder.products?.map((item) => (
                  <Grid item xs={12} md={6} key={item.MASANPHAM}>
                    <Card sx={{ padding: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {" "}
                        <Box>
                          {" "}
                          <Typography variant="body1">
                            Mã sản phẩm: {item.MASANPHAM}
                          </Typography>
                          <Typography variant="body1">
                            Tên sản phẩm: {item.TENSANPHAM}
                          </Typography>
                          <Typography variant="body1">
                            Số lượng: {item.SOLUONGSP}
                          </Typography>
                          <Typography variant="body1">
                            Giá:{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.SANPHAM_GIA)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Mô tả: {item.SANPHAM_MOTA}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Trạng thái: {item.TRANGTHAISANPHAM}
                          </Typography>
                        </Box>
                        <img
                          style={{ width: "100px", height: "100px" }}
                          src={`${api}/images/${item.HINHANHSANPHAM}`}
                          alt=""
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

// Styles for modal box
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: 4,
  borderRadius: 2,
  boxShadow: 24,
  maxWidth: "80%",
  overflowY: "auto",
};

export default DonHang_DaHuy_User;
