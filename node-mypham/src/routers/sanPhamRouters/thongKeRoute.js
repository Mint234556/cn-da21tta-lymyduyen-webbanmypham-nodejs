const express = require("express");
const router = express.Router();
const {
  getTotalOrders,
  getTotalRevenue,
  getTotalCustomers,
  getTopFiveBestSellers,
  getOnlineUsersCount,

  //
} = require("../../controllers/sanPhamController/thongKeController");

router.get("/orders", getTotalOrders);
router.get("/revenue", getTotalRevenue);
router.get("/customers", getTotalCustomers);
router.get("/best-seller", getTopFiveBestSellers);
router.get("/online-users", getOnlineUsersCount);

module.exports = router;
