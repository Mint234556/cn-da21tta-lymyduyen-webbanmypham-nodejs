import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import moment from "moment"; // Đảm bảo đã import thư viện moment
const ProductManager = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    MALOAISANPHAM: "",
    TENSANPHAM: "",
    MOTA: "",
    GIA: "",
    SOLUONG: "",
    HINHANHSANPHAM: null, // Hình ảnh sẽ là file
    TRANGTHAISANPHAM: "Đang hoạt động",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api}/san-pham`);
      setProducts(response.data.DT);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/danh-muc/`);
      setCategories(response.data.DT);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, HINHANHSANPHAM: e.target.files[0] });
  };

  // Open dialog for create or edit
  const handleOpen = (product = null) => {
    console.log("product", product);
    setIsEdit(!!product);
    setEditingId(product?.MASANPHAM || null);

    setFormData(
      product
        ? {
            MALOAISANPHAM: product.MALOAISANPHAM || "",
            TENSANPHAM: product.TENSANPHAM || "",
            MOTA: product.MOTA_SANPHAM || "",
            GIA: product.GIA || "",
            SOLUONG: product.SOLUONG || "",
            HINHANHSANPHAM: product.HINHANHSANPHAM || null,
            TRANGTHAISANPHAM: product.TRANGTHAISANPHAM || "Đang hoạt động",
          }
        : {
            MALOAISANPHAM: "",
            TENSANPHAM: "",
            MOTA: "",
            GIA: "",
            SOLUONG: "",
            HINHANHSANPHAM: null,
            TRANGTHAISANPHAM: "Đang hoạt động",
          }
    );
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setFormData({});
  };

  // Create or update product
  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      if (isEdit) {
        await axios.put(`${api}/san-pham/${editingId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${api}/san-pham`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchProducts();
      handleClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/san-pham/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
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
          Quản lý sản phẩm
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên mỹ phẩm</TableCell>{" "}
              <TableCell>Loại sản phẩm</TableCell>
              <TableCell>Giá tiền</TableCell>
              <TableCell>Số lượng </TableCell>
              <TableCell>Hình ảnh </TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thời gian cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.MASANPHAM}>
                <TableCell>{product.TENSANPHAM}</TableCell>
                <TableCell>{product.TENLOAISANPHAM}</TableCell>
                <TableCell>{product.GIA}</TableCell>
                <TableCell>{product.SOLUONG}</TableCell>
                <TableCell>
                  <img
                    src={`${api}/images/${product.HINHANHSANPHAM}`}
                    alt=""
                    style={{ height: "40px" }}
                  />
                </TableCell>

                <TableCell>{product.MOTA_SANPHAM}</TableCell>

                <TableCell
                  style={{
                    color:
                      product.TRANGTHAISANPHAM === "Đang hoạt động"
                        ? "green"
                        : "red",
                  }}
                >
                  {product.TRANGTHAISANPHAM}
                </TableCell>

                <TableCell>
                  {moment(product.UPDATED_AT_SP).format("DD/MM/YYYY")}
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpen(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(product.MASANPHAM)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Create/Edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Danh mục sản phẩm</InputLabel>
            <Select
              name="MALOAISANPHAM"
              value={formData.MALOAISANPHAM}
              label="Danh mục sản phẩm"
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.MALOAISANPHAM}
                  value={category.MALOAISANPHAM}
                >
                  {category.TENLOAISANPHAM}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Tên sản phẩm"
            name="TENSANPHAM"
            fullWidth
            value={formData.TENSANPHAM}
            onChange={handleChange}
          />

          <TextField
            margin="dense"
            label="Mô tả"
            name="MOTA"
            fullWidth
            value={formData.MOTA}
            onChange={handleChange}
          />

          <TextField
            margin="dense"
            label="Giá"
            name="GIA"
            type="number"
            fullWidth
            value={formData.GIA}
            onChange={handleChange}
          />

          <TextField
            margin="dense"
            label="Số lượng"
            name="SOLUONG"
            type="number"
            fullWidth
            value={formData.SOLUONG}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/*"
            name="HINHANHSANPHAM"
            onChange={handleFileChange}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="TRANGTHAISANPHAM"
              value={formData.TRANGTHAISANPHAM}
              label="Trạng thái"
              onChange={handleChange}
            >
              <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
              <MenuItem value="Ngưng hoạt động">Ngưng hoạt động</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManager;
