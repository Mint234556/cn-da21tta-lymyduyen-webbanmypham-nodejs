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
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
const KhuyenMaiCRUD = () => {
  const api = process.env.REACT_APP_URL_SERVER; // Đổi thành URL API của bạn
  const [khuyenMaiList, setKhuyenMaiList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingKhuyenMai, setEditingKhuyenMai] = useState(null);
  const [formData, setFormData] = useState({
    CODE: "",
    MOTA: "",
    HANSUDUNG: "",
    SOTIENGIAM: 0,
  });

  // Lấy danh sách khuyến mãi
  useEffect(() => {
    fetchKhuyenMai();
  }, []);

  const fetchKhuyenMai = async () => {
    try {
      const response = await axios.get(`${api}/khuyen-mai`);
      setKhuyenMaiList(response.data.DT);
    } catch (error) {
      console.error("Error fetching khuyen mai:", error);
    }
  };

  // Xử lý thay đổi dữ liệu biểu mẫu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thêm hoặc cập nhật
  const handleSubmit = async () => {
    if (editingKhuyenMai) {
      // Cập nhật khuyến mãi
      try {
        const response = await axios.put(
          `${api}/khuyen-mai/${editingKhuyenMai.MAKHUYENMAI}`,
          formData
        );
        setKhuyenMaiList((prev) =>
          prev.map((km) =>
            km.MAKHUYENMAI === editingKhuyenMai.MAKHUYENMAI
              ? response.data.DT
              : km
          )
        );
        setEditingKhuyenMai(null);
        fetchKhuyenMai();
      } catch (error) {
        console.error("Error updating khuyen mai:", error);
      }
    } else {
      // Thêm mới khuyến mãi
      try {
        const response = await axios.post(`${api}/khuyen-mai`, formData);
        setKhuyenMaiList((prev) => [...prev, response.data.DT]);
        fetchKhuyenMai();
      } catch (error) {
        console.error("Error creating khuyen mai:", error);
      }
    }
    setFormData({ CODE: "", MOTA: "", HANSUDUNG: "" });
    setOpenDialog(false);
  };

  // Xử lý sửa
  const handleEdit = (khuyenMai) => {
    setEditingKhuyenMai(khuyenMai);
    setFormData({
      SOTIENGIAM: khuyenMai.SOTIENGIAM,
      CODE: khuyenMai.CODE,
      MOTA: khuyenMai.MOTA,
      HANSUDUNG: khuyenMai.HANSUDUNG ? khuyenMai.HANSUDUNG.split("T")[0] : "", // Chuyển sang yyyy-MM-dd
    });
    setOpenDialog(true);
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      try {
        await axios.delete(`${api}/khuyen-mai/${id}`);
        setKhuyenMaiList((prev) => prev.filter((km) => km.MAKHUYENMAI !== id));
      } catch (error) {
        console.error("Error deleting khuyen mai:", error);
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button variant="text" sx={{ fontSize: "20px" }}>
          Quản lý khuyến mãi
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingKhuyenMai(null);
            setFormData({ CODE: "", MOTA: "", HANSUDUNG: "" });
            setOpenDialog(true);
          }}
        >
          Thêm khuyến mãi
        </Button>
      </Box>

      {/* Dialog Thêm/Sửa Khuyến Mãi */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingKhuyenMai ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Code"
            name="CODE"
            value={formData.CODE}
            onChange={handleChange}
            fullWidth
          />{" "}
          <TextField
            margin="dense"
            label="Số tiền giảm"
            name="SOTIENGIAM"
            type="number"
            value={formData.SOTIENGIAM}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="mota-label">Mô tả trạng thái</InputLabel>
            <Select
              labelId="mota-label"
              value={formData.MOTA}
              name="MOTA"
              onChange={handleChange}
              label="Mô tả trạng thái"
            >
              <MenuItem value="Đã được sử dụng">Đã được sử dụng</MenuItem>
              <MenuItem value="Chưa được sử dụng">Chưa được sử dụng</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Hạn sử dụng"
            name="HANSUDUNG"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.HANSUDUNG}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bảng hiển thị danh sách khuyến mãi */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Số tiền giảm</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hạn sử dụng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {khuyenMaiList.map((km) => (
              <TableRow key={km.MAKHUYENMAI}>
                <TableCell>{km.MAKHUYENMAI}</TableCell>
                <TableCell>{km.CODE}</TableCell>{" "}
                <TableCell>
                  {km.SOTIENGIAM.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </TableCell>
                <TableCell>{km.MOTA}</TableCell>
                <TableCell>
                  {moment(km.HANSUDUNG).format("DD/MM/YYYY HH:mm")}
                </TableCell>
                {km.MOTA === "Chưa được sử dụng" ? (
                  <>
                    {" "}
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(km)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(km.MAKHUYENMAI)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <></>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KhuyenMaiCRUD;
