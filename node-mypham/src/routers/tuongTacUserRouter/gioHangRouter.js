const express = require("express");
const router = express.Router();

const {
  getGioHang,
  createGioHang,

  deleteGioHang,
  addSingleProductToCart,
  removeSingleProductFromCart,
  getCartProductsByUser,
  getCartTotalQuantity,
} = require("../../controllers/tuongTacUserController/gioHangController");

router.post("/", createGioHang);
router.post("/add-single", addSingleProductToCart);
router.post("/remove-single", removeSingleProductFromCart);
router.post("/remove-products", deleteGioHang);
router.get("/use/cart-user/:id", getCartProductsByUser);
router.get("/:id_nguoidung", getGioHang);
router.get("/total-quantity/:id", getCartTotalQuantity);

module.exports = router;
