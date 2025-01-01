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

  ///
  getDON_HANG_DangXuLy,
  getDON_HANG_DaHuy,
  getDON_HANG_DaThanhToan,
  // user
  getDON_HANGByIDUser,
  getDON_HANG_DangXuLyByIDUser,
  getDON_HANG_DaHuyByIDUser,
  getDON_HANG_DaThanhToanByIDUser,
} = require("../../controllers/thanhToanController/donHangController");
// Định nghĩa các route
router.get("/", getDON_HANG); //admin
router.get("/dang-xu-ly", getDON_HANG_DangXuLy); //admin
router.get("/da-huy", getDON_HANG_DaHuy); //admin
router.get("/da-thanh-toan", getDON_HANG_DaThanhToan); //admin
// user
router.get("/:userId", getDON_HANG);
router.get("/dang-xu-ly/:userId", getDON_HANG_DangXuLy);
router.get("/da-huy/:userId", getDON_HANG_DaHuy);
router.get("/da-thanh-toan/:userId", getDON_HANG_DaThanhToan);
//
router.get("/:id", getDON_HANG_ByIDUser);
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
