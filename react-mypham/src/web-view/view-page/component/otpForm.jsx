import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";

import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
const api = process.env.REACT_APP_URL_SERVER;
const OtpForm = ({ email, setActiveStep, emailRegister, handleRegister }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleVerifyOtp = async () => {
    try {
      const emailS = emailRegister ? emailRegister : email;
      setLoading(true);
      const response = await axios.post(`${api}/check-otp`, {
        email: emailS,
        otp,
      });
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        setActiveStep(2);
        if (emailRegister) {
          handleRegister();
          navigate("/login");
        }
      } else {
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.response?.data?.EM || "Lỗi xác thực OTP!", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TextField
        fullWidth
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleVerifyOtp}
        disabled={!otp || loading}
        sx={{ mt: 2 }}
      >
        Verify OTP
      </Button>
    </Box>
  );
};

export default OtpForm;
