import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logo/favicon.png";
import { login, setUserInfo } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
const LoginForm = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      // Kiểm tra email và mật khẩu
      if (!email || !password) {
        setErrorMessage("Email và mật khẩu không được để trống");
        return;
      }

      // Reset thông báo lỗi
      setErrorMessage("");
      setSuccessMessage("");

      // Gọi API đăng nhập
      const response = await axios.post(`${api}/login`, { email, password });
      const { EC, EM, DT } = response.data;

      if (EC === 1) {
        // Đăng nhập thành công
        setSuccessMessage(EM);

        // Dispatch action `login` từ Redux
        dispatch(
          login({
            accessToken: DT.accessToken,
            userInfo: DT.userInfo,
          })
        );

        // Chuyển hướng sang trang dashboard hoặc trang khác
        navigate("/");
      } else {
        // Hiển thị lỗi từ API
        setErrorMessage(EM);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.error("Login error:", error);
      setErrorMessage("Đã xảy ra lỗi khi đăng nhập, vui lòng thử lại.");
    }
  };
  const handleToBack = () => {};
  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        backgroundColor: "#fff5f8", // Màu nền nhẹ nhàng phù hợp với mỹ phẩm
        borderRadius: 2,
        boxShadow: 2,
        mt: 4,
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          sx={{ color: "black" }}
        >
          Quay lại
        </Button>
        <img
          src={`https://image.cocoonvietnam.com/uploads/vegan_society_41cc2b390a.svg`}
          alt="Mỹ Phẩm Logo"
          style={{ width: "80px" }}
        />
      </Grid>
      <Typography variant="h6" align="center" gutterBottom>
        Chào mừng trở lại!
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary" mb={3}>
        Vui lòng đăng nhập để tiếp tục trải nghiệm những sản phẩm tuyệt vời!
      </Typography>
      {/* Trường Email */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={handleEmailChange}
        type="email"
        sx={{ marginBottom: 2 }}
      />
      {/* Trường Mật khẩu */}
      <TextField
        label="Mật khẩu"
        variant="outlined"
        fullWidth
        value={password}
        onChange={handlePasswordChange}
        type="password"
        sx={{ marginBottom: 2 }}
      />
      {/* Ghi nhớ tài khoản */}
      {/* <FormControlLabel
        control={
          <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
        }
        label="Lưu tài khoản để tiện lợi hơn khi mua sắm"
      /> */}
      {/* Nút Đăng nhập */}
      <Box mt={2}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleLogin}
          disabled={!email || !password}
          sx={{
            backgroundColor: "#f06292", // Màu hồng phù hợp với mỹ phẩm
            "&:hover": {
              backgroundColor: "#e91e63", // Màu tối hơn khi hover
            },
          }}
        >
          Đăng Nhập
        </Button>
      </Box>
      {/* Lợi ích */}
      <Box mt={3} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          Bạn chưa có tài khoản?
        </Typography>
        <Button
          variant="text"
          color="primary"
          component={Link} // Sử dụng Link component
          to="/register" // Đường dẫn đến trang đăng ký
          sx={{ fontWeight: "bold", textTransform: "none" }}
        >
          Đăng ký ngay
        </Button>
      </Box>{" "}
      <Box mt={3} textAlign="center">
        <Button
          variant="text"
          color="primary"
          component={Link} // Sử dụng Link component
          to="/forget-password" // Đường dẫn đến trang đăng ký
          sx={{ fontWeight: "bold", textTransform: "none" }}
        >
          Quên mật khâu
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
