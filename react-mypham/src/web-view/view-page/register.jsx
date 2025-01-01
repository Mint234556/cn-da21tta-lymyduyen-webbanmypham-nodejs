import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../../public/logo/favicon.png";
import OtpForm from "./component/otpForm";
import EmailForm from "./component/sendOtp";
const RegisterForm = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const steps = ["Sent OTP", "Verify OTP"];
  const [isOpenOtp, setIsOpenOtp] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    confirmPassword: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

  const handleRegister = async () => {
    try {
      const { email, password, fullName, phone, confirmPassword } = formData;

      // Kiểm tra thông tin bắt buộc
      if (!email || !password || !fullName || !phone) {
        setErrorMessage("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }
      if (confirmPassword !== password) {
        enqueueSnackbar("Mật khẩu không khớp", { variant: "error" });
        return;
      }
      // Reset thông báo
      setErrorMessage("");
      setSuccessMessage("");

      // Gọi API đăng ký
      const response = await axios.post(`${api}/register`, {
        formData,
      });

      const { EC, EM } = response.data;

      if (EC === 1) {
        // Đăng ký thành công
        setSuccessMessage(EM);
        setFormData({
          email: "",
          password: "",
          fullName: "",
          phone: "",
          address: "",
        });
      } else {
        // Hiển thị lỗi từ API
        setErrorMessage(EM);
      }
    } catch (error) {
      console.error("Register error:", error);
      setErrorMessage("Đã xảy ra lỗi khi đăng ký, vui lòng thử lại.");
    }
  };

  const handleClickOpen = () => {
    if (formData.confirmPassword !== formData.password) {
      enqueueSnackbar("Mật khẩu không khớp", { variant: "error" });
      return;
    }
    setIsOpenOtp(true);
  };
  return (
    <>
      {!isOpenOtp ? (
        <>
          {" "}
          <Box
            sx={{
              maxWidth: 400,
              margin: "auto",
              padding: 3,
              backgroundColor: "#fff5f8",
              borderRadius: 2,
              boxShadow: 2,
              mt: 2,
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                sx={{ color: "black" }}
                component={Link}
                to="/login"
              >
                Quay lại
              </Button>
              <img
                src={`https://image.cocoonvietnam.com/uploads/vegan_society_41cc2b390a.svg`}
                alt="PNJ"
                style={{ width: "80px" }}
              />
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>
              Đăng ký tài khoản
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="textSecondary"
              mb={3}
            >
              Vui lòng nhập thông tin để đăng ký tài khoản mới
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ marginBottom: 2 }}>
                {successMessage}
              </Alert>
            )}

            {/* Trường Họ và tên */}
            <TextField
              label="Họ và tên"
              variant="outlined"
              fullWidth
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />

            {/* Trường Email */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              sx={{ marginBottom: 2 }}
            />

            {/* Trường Mật khẩu */}
            <TextField
              label="Mật khẩu"
              variant="outlined"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              sx={{ marginBottom: 2 }}
            />
            {/* Trường Nhập Lại Mật khẩu */}
            <TextField
              label="Nhập Lại Mật khẩu"
              variant="outlined"
              fullWidth
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              sx={{ marginBottom: 2 }}
            />
            {/* Trường Số điện thoại */}
            <TextField
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              sx={{ marginBottom: 2 }}
            />

            {/* Trường Địa chỉ */}
            <TextField
              label="Địa chỉ (tùy chọn)"
              variant="outlined"
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />

            {/* Ghi nhớ tài khoản */}
            <FormControlLabel
              control={
                <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
              }
              label="Đồng ý với điều khoản và chính sách bảo mật"
            />

            {/* Nút Đăng ký */}
            <Box mt={2}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleClickOpen}
                disabled={
                  !formData.email || !formData.password || !formData.fullName
                }
              >
                Đăng ký
              </Button>
            </Box>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Đã có tài khoản?
              </Typography>
              <Button
                variant="text"
                color="primary"
                component={Link}
                to="/login"
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Đăng nhập
              </Button>
            </Box>
          </Box>{" "}
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", p: 3 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && (
              <EmailForm
                setActiveStep={setActiveStep}
                setEmail={setEmail}
                emailRegister={formData.email}
                setIsOpenOtp={setIsOpenOtp}
              />
            )}
            {activeStep === 1 && (
              <OtpForm
                handleRegister={handleRegister}
                emailRegister={formData.email}
                setActiveStep={setActiveStep}
              />
            )}
          </Box>{" "}
        </>
      )}
    </>
  );
};

export default RegisterForm;
