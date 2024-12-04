const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/sanPhamController/categoriesController");

// Lấy tất cả danh mục
router.get("/categories", getAllCategories);

// Lấy danh mục theo ID
router.get("/categories/:id", getCategoryById);

// Tạo mới một danh mục
router.post("/categories", createCategory);

// Cập nhật thông tin danh mục
router.put("/categories/:id", updateCategory);

// Xóa danh mục
router.delete("/categories/:id", deleteCategory);

module.exports = router;
