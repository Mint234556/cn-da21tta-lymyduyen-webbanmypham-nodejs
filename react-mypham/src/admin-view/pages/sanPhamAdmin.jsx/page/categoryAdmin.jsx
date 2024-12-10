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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const CategoryCRUD = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    TENLOAISANPHAM: "",
    MOTA: "",
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/danh-muc/`);
      setCategories(response.data.DT);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for add/update
  const handleSubmit = async () => {
    if (editingCategory) {
      // Update category
      try {
        const response = await axios.put(
          `${api}/danh-muc/${editingCategory.MALOAISANPHAM}`,
          formData
        );
        setCategories((prev) =>
          prev.map((cat) =>
            cat.MALOAISANPHAM === editingCategory.MALOAISANPHAM
              ? response.data.DT
              : cat
          )
        );
        setEditingCategory(null);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    } else {
      // Add category
      try {
        const response = await axios.post(`${api}/danh-muc/`, formData);
        setCategories((prev) => [...prev, response.data.DT]);
      } catch (error) {
        console.error("Error creating category:", error);
      }
    }
    setFormData({
      TENLOAISANPHAM: "",
      MOTA: "",
    });
    setOpenDialog(false);
  };

  // Handle edit button
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      TENLOAISANPHAM: category.TENLOAISANPHAM,
      MOTA: category.MOTA,
    });
    setOpenDialog(true);
  };

  // Handle delete button
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await axios.delete(`${api}/danh-muc/${id}`);
        setCategories((prev) => prev.filter((cat) => cat.MALOAISANPHAM !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
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
          Quản lý danh mục
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingCategory(null);
            setFormData({
              TENLOAISANPHAM: "",
              MOTA: "",
            });
            setOpenDialog(true);
          }}
        >
          Thêm danh mục
        </Button>
      </Box>

      {/* Dialog for Adding/Editing Category */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Category Name"
            name="TENLOAISANPHAM"
            value={formData.TENLOAISANPHAM}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Category Description"
            name="MOTA"
            value={formData.MOTA}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display Categories */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Danh Mục</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.MALOAISANPHAM}>
                <TableCell>{category.MALOAISANPHAM}</TableCell>
                <TableCell>{category.TENLOAISANPHAM}</TableCell>
                <TableCell>{category.MOTA}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(category)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(category.MALOAISANPHAM)}
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
  );
};

export default CategoryCRUD;
