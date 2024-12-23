import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
const api = process.env.REACT_APP_URL_SERVER;
const ResetPasswordForm = ({ email }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      enqueueSnackbar("Mật khẩu không khớp!", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${api}/update-password`, {
        email,
        password,
      });
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        navigate("/login");
      } else {
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.EM || "Lỗi cập nhật mật khẩu!", {
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
        type="password"
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleResetPassword}
        disabled={!password || !confirmPassword || loading}
        sx={{ mt: 2 }}
      >
        Reset Password
      </Button>
    </Box>
  );
};

export default ResetPasswordForm;
