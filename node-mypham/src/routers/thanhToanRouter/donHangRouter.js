const express = require("express");
const router = express.Router();
const {
  getDON_HANG,
  createDON_HANG,
  updateDON_HANG,
  deleteDON_HANG,
  updateTrangThaiDonHang,
  getDON_HANG_ByIDUser,
  updateOrderStatusCanceled_User,
  updateOrderStatusCanceled,
  updateOrderStatusSuccess,
} = require("../../controllers/thanhToanController/donHangController");
// Định nghĩa các route
router.get("/", getDON_HANG); //admin
router.get("/:id", getDON_HANG_ByIDUser); //admin
router.post("/", createDON_HANG);
router.post("/hoan-tat", updateTrangThaiDonHang);
router.put("/:id", updateDON_HANG);
router.delete("/:id", deleteDON_HANG);

//Success - Admin
router.put("/:orderId/success", updateOrderStatusSuccess);

//Cancel - Admin
router.put("/:orderId/canceled", updateOrderStatusCanceled);

//Cancel - User
// router.put(
//   "/api/user/orders/:orderId/canceled",
//   updateOrderStatusCanceled_User
// );

module.exports = router;
