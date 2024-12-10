const express = require("express");
const router = express.Router();

const {
  getSAN_PHAM,
  createSAN_PHAM,
  updateSAN_PHAM,
  deleteSAN_PHAM,
  getSAN_PHAM_Use,
  getLatest2Products,
  getTop5BestSellingProducts,
  getTopExpensiveProducts,
  getSAN_PHAM_Use_ById,
  getSAN_PHAM_Search,
} = require("../../controllers/sanPhamController/SanPhamController");
const uploads = require("../../config/multerConfig");
// Định nghĩa các route

router.get("/use/last2products", getLatest2Products);
router.get("/", getSAN_PHAM);
router.get("/use/", getSAN_PHAM_Use);

router.get("/use/5best-selling", getTop5BestSellingProducts);
router.get("/use/5best-expensive", getTopExpensiveProducts);

router.post("/", uploads.single("HINHANHSANPHAM"), createSAN_PHAM);
router.put("/:id", uploads.single("HINHANHSANPHAM"), updateSAN_PHAM);
router.delete("/:id", deleteSAN_PHAM);
router.get("/use/:id", getSAN_PHAM_Use_ById);
router.get("/search", getSAN_PHAM_Search);

module.exports = router;
