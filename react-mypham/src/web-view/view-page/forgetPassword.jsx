import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import EmailForm from "./component/sendOtp";
import ResetPasswordForm from "./component/resetPassword";
import OtpForm from "./component/otpForm";

const steps = ["Enter Email", "Verify OTP", "Reset Password"];

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", p: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <EmailForm setActiveStep={setActiveStep} setEmail={setEmail} />
      )}
      {activeStep === 1 && (
        <OtpForm email={email} setActiveStep={setActiveStep} />
      )}
      {activeStep === 2 && <ResetPasswordForm email={email} />}
    </Box>
  );
};

export default ForgotPassword;
