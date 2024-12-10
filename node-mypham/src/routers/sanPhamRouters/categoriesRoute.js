const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getAllDanhMucSanPham,
  getDanhMucSanPhamById,
  createDanhMucSanPham,
  updateDanhMucSanPham,
  deleteDanhMucSanPham,
} = require("../../controllers/sanPhamController/categoriesController");

// Lấy tất cả danh mục
router.get("/", getAllDanhMucSanPham);

// Lấy danh mục theo ID
router.get("/:id", getDanhMucSanPhamById);

// Tạo mới một danh mục
router.post("/", createDanhMucSanPham);

// Cập nhật thông tin danh mục
router.put("/:id", updateDanhMucSanPham);

// Xóa danh mục
router.delete("/:id", deleteDanhMucSanPham);

module.exports = router;
