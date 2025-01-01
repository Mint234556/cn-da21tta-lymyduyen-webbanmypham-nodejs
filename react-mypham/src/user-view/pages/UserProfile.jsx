import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
const UserProfile = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    TENNGUOIDUNG: "",
    EMAIL: "",
    DIACHI: "",
    SODIENTHOAI: "",
    MATKHAU: "",
    CURRENT_PASSWORD: "",
    AVATAR: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("accessToken");

        if (!token) {
          // Nếu không có token, điều hướng người dùng ra trang chủ
          navigate("/");
          return;
        }

        // Kiểm tra tính hợp lệ của token bằng cách giải mã và xử lý lỗi nếu token không hợp lệ
        try {
          const decoded = jwtDecode(token);
          setDataUser(decoded);
        } catch (decodeError) {
          console.error("Invalid token:", decodeError);
          navigate("/"); // Điều hướng ra trang chủ nếu token không hợp lệ
          return;
        }
        const decoded = jwtDecode(token);
        const response = await axios.get(`${api}/user/${decoded.MANGUOIDUNG}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Kiểm tra nếu người dùng không tồn tại (ví dụ: response.data.DT là mảng rỗng)
        if (response.data.DT.length === 0) {
          navigate("/"); // Điều hướng ra trang chủ nếu không phải người dùng hợp lệ
          return;
        }

        setUserData(response.data.DT[0]);
        setFormData({
          TENNGUOIDUNG: response.data.DT[0].TENNGUOIDUNG,
          EMAIL: response.data.DT[0].EMAIL,
          DIACHI: response.data.DT[0].DIACHI,
          SODIENTHOAI: response.data.DT[0].SODIENTHOAI,
          MATKHAU: response.data.DT[0].MATKHAU,
          AVATAR: response.data.DT[0].AVATAR,
        });
        setAvatarPreview(`${api}/images/${response.data.DT[0].AVATAR}`);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/"); // Điều hướng ra trang chủ nếu có lỗi xảy ra
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [api, navigate]); // Thêm navigate vào dependency array

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("AVATAR", avatarFile);

        const response = await axios.put(
          `${api}/user/${dataUser.MANGUOIDUNG}`,
          formData
        );
        if (response.data.EC === 1) {
          enqueueSnackbar(response.data.EM, { variant: "success" });
        } else {
          enqueueSnackbar(response.data.EM, { variant: "error" });
        }
      }

      const response = await axios.put(
        `${api}/user/${dataUser.MANGUOIDUNG}`,
        formData
      );
      if (response.data.EC === 1) {
        setUserData(response.data.DT);
        enqueueSnackbar(response.data.EM, { variant: "success" });
      } else if (response.data.EC === 0) {
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }

      setIsEditing(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.EM, { variant: "error" });
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  console.log("user", userData);
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar
          src={`${api}/images/${userData?.AVATAR}`}
          alt={userData?.TENNGUOIDUNG}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="h5">{userData?.TENNGUOIDUNG || "User"}</Typography>
      </Box>{" "}
      {isEditing && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Change Avatar:
          </Typography>
          <input
            name="AVATAR"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </Box>
      )}
      {isEditingPassword ? (
        <>
          {" "}
          <TextField
            margin="normal"
            type="password"
            label="Nhập Mật khẩu Cũ"
            name="CURRENT_PASSWORD"
            value={formData.CURRENT_PASSWORD || ""}
            onChange={handleChange}
            fullWidth
          />{" "}
          <TextField
            margin="normal"
            type="password"
            label="Nhập Mật khẩu Mới"
            name="MATKHAU"
            value={formData.MATKHAU || ""}
            onChange={handleChange}
            fullWidth
          />{" "}
          <TextField
            margin="normal"
            type="password"
            label="Xác nhận mật khẩu mới"
            name="MATKHAUMOI"
            value={confirmPassword || ""}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />{" "}
        </>
      ) : (
        <>
          {" "}
          <TextField
            margin="normal"
            label="Họ và tên"
            name="TENNGUOIDUNG"
            value={formData.TENNGUOIDUNG || ""}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
          />
          <TextField
            margin="normal"
            label="Email"
            name="email"
            value={formData.EMAIL || ""}
            onChange={handleChange}
            fullWidth
            disabled={true}
          />
          <TextField
            margin="normal"
            label="Số điện thoại"
            name="SODIENTHOAI"
            value={formData.SODIENTHOAI || ""}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
          />
          <TextField
            margin="normal"
            label="Địa chỉ"
            name="DIACHI"
            value={formData.DIACHI || ""}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
          />{" "}
        </>
      )}
      {isEditing ? (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      ) : (
        <>
          {" "}
          {!isEditingPassword ? (
            <>
              {" "}
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa thông tin
              </Button>{" "}
            </>
          ) : (
            false
          )}
        </>
      )}{" "}
      {isEditingPassword ? (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={() => setIsEditingPassword(false)}
          >
            Hủy bỏ
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Box>
      ) : (
        <>
          {" "}
          {!isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setIsEditingPassword(true)}
              >
                Thay đổi mật khẩu
              </Button>{" "}
            </>
          ) : (
            false
          )}
        </>
      )}
    </Box>
  );
};

export default UserProfile;
