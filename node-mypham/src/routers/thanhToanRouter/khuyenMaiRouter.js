// routes/sanPhamRoutes/khuyenMaiRoutes.js

const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getAllKhuyenMai,
  getKhuyenMaiByCODE,
  createKhuyenMai,
  updateKhuyenMai,
  deleteKhuyenMai,
} = require("../../controllers/thanhToanController/khuyenMaiController");

// Lấy tất cả khuyến mãi
router.get("/", getAllKhuyenMai);

// Lấy khuyến mãi theo ID
router.get("/:CODE", getKhuyenMaiByCODE);

// Tạo mới khuyến mãi
router.post("/", createKhuyenMai);

// Cập nhật thông tin khuyến mãi
router.put("/:MAKHUYENMAI", updateKhuyenMai);

// Xóa khuyến mãi
router.delete("/:MAKHUYENMAI", deleteKhuyenMai);

module.exports = router;
