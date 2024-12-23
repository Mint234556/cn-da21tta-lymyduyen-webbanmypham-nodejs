import React, { useState } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
const api = process.env.REACT_APP_URL_SERVER;
const EmailForm = ({
  setActiveStep,
  setEmail,
  emailRegister,
  setIsOpenOtp,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      const email = emailRegister ? emailRegister : emailInput;
      setLoading(true);
      const response = await axios.post(`${api}/send-otp`, {
        email: email,
      });
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        setEmail(emailInput);
        setActiveStep(1);
      } else {
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.EM, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {emailRegister ? (
        <>
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            sx={{ color: "black" }}
            onClick={() => setIsOpenOtp(false)}
          >
            Quay lại
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField fullWidth label="Email" value={emailRegister} disabled />
            <IconButton onClick={handleSendOtp} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>{" "}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOtp}
            sx={{ mt: 2 }}
          >
            Send OTP
          </Button>
        </>
      ) : (
        <>
          {" "}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              label="Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <IconButton onClick={handleSendOtp} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>{" "}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOtp}
            disabled={!emailInput || loading}
            sx={{ mt: 2 }}
          >
            Send OTP
          </Button>
        </>
      )}
    </Box>
  );
};

export default EmailForm;
