import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const UserManagement = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    TENNGUOIDUNG: "",
    EMAIL: "",
    DIACHI: "",
    SODIENTHOAI: "",
    TRANGTHAINGUOIDUNG: "",

    VAITRO: "",
    AVATAR: "",
  });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${api}/user/`);
      setUsers(response.data.DT);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for add/update
  const handleSubmit = async () => {
    if (editingUser) {
      // Update user
      try {
        const response = await axios.put(
          `${api}/user/${editingUser.MANGUOIDUNG}`,
          formData
        );
        setUsers((prev) =>
          prev.map((user) =>
            user.MANGUOIDUNG === editingUser.MANGUOIDUNG
              ? response.data.DT
              : user
          )
        );
        setEditingUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      // Add user
      try {
        const response = await axios.post(`${api}/user/`, formData);
        setUsers((prev) => [...prev, response.data.DT]);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
    setFormData({
      TENNGUOIDUNG: "",
      EMAIL: "",
      DIACHI: "",
      SODIENTHOAI: "",
      TRANGTHAINGUOIDUNG: "",

      VAITRO: "",
      AVATAR: "",
    });
    setOpenDialog(false);
  };

  // Handle edit button
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      TENNGUOIDUNG: user.TENNGUOIDUNG,
      EMAIL: user.EMAIL,
      DIACHI: user.DIACHI,
      SODIENTHOAI: user.SODIENTHOAI,
      TRANGTHAINGUOIDUNG: user.TRANGTHAINGUOIDUNG,

      VAITRO: user.VAITRO,
      AVATAR: user.AVATAR,
    });
    setOpenDialog(true);
  };

  // Handle delete button
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await axios.delete(`${api}/user/${id}`);
        setUsers((prev) => prev.filter((user) => user.MANGUOIDUNG !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button variant="text" sx={{ fontSize: "20px" }}>
            Quản lý người dùng
          </Button>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditingUser(null);
              setFormData({
                TENNGUOIDUNG: "",
                EMAIL: "",
                DIACHI: "",
                SODIENTHOAI: "",
                TRANGTHAINGUOIDUNG: "",
                MATKHAU: "",
                VAITRO: "",
                AVATAR: "",
              });
              setOpenDialog(true);
            }}
          >
            Thêm người dùng
          </Button> */}
        </Box>

        {/* Dialog for Adding/Editing User */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Tên Người Dùng"
              name="TENNGUOIDUNG"
              value={formData.TENNGUOIDUNG}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="EMAIL"
              value={formData.EMAIL}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Địa Chỉ"
              name="DIACHI"
              value={formData.DIACHI}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Số Điện Thoại"
              name="SODIENTHOAI"
              value={formData.SODIENTHOAI}
              onChange={handleChange}
              fullWidth
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Trạng Thái</InputLabel>
              <Select
                name="TRANGTHAINGUOIDUNG"
                value={formData.TRANGTHAINGUOIDUNG}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
                <MenuItem value="Ngưng hoạt động">Ngưng hoạt động</MenuItem>
              </Select>
            </FormControl>
            {/* <TextField
              margin="dense"
              label="Mật Khẩu"
              name="MATKHAU"
              value={formData.MATKHAU}
              onChange={handleChange}
              type="password"
              fullWidth
            /> */}

            <FormControl fullWidth margin="dense">
              <InputLabel>Vai Trò</InputLabel>
              <Select
                name="VAITRO"
                value={formData.VAITRO}
                onChange={handleChange}
                label="Vai Trò"
              >
                <MenuItem value="admin">Người quản trị</MenuItem>
                <MenuItem value="user">Người dùng</MenuItem>
              </Select>
            </FormControl>
            {/* <TextField
              margin="dense"
              label="Avatar URL"
              name="AVATAR"
              value={formData.AVATAR}
              onChange={handleChange}
              fullWidth
              dis
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Display Users */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Tên Người Dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Địa Chỉ</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Vai Trò</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.MANGUOIDUNG}>
                  {" "}
                  <TableCell>{user.MANGUOIDUNG}</TableCell>{" "}
                  <TableCell>
                    <Avatar
                      src={`${api}/images/${user.AVATAR}`}
                      alt={user.TENNGUOIDUNG}
                      sx={{ width: 40, height: 40 }}
                    />
                  </TableCell>
                  <TableCell>{user.TENNGUOIDUNG}</TableCell>
                  <TableCell>{user.EMAIL}</TableCell>
                  <TableCell>{user.DIACHI}</TableCell>
                  <TableCell>{user.SODIENTHOAI}</TableCell>
                  <TableCell>{user.TRANGTHAINGUOIDUNG}</TableCell>
                  <TableCell>{user.VAITRO}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.MANGUOIDUNG)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default UserManagement;
