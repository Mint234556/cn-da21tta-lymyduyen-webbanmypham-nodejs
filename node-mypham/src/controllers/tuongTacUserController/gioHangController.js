const connection = require("../../config/database"); // Đảm bảo `connection` được import từ tệp kết nối cơ sở dữ liệu của bạn
const moment = require("moment");

// 1. Lấy danh sách giỏ hàng của người dùng
const getGioHang = async (req, res) => {
  const { id_nguoidung } = req.params;
  try {
    const [results] = await connection.execute(
      "SELECT * FROM `GIO_HANG` WHERE ID_NGUOI_DUNG = ?",
      [id_nguoidung]
    );
    res.status(200).json({ EM: "Lấy giỏ hàng thành công", EC: 1, DT: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ EM: "Lỗi hệ thống", EC: -1 });
  }
};

// 2. Thêm sản phẩm vào giỏ hàng
const createGioHang = async (req, res) => {
  const { ID_SAN_PHAM, ID_NGUOI_DUNG, NGAY_CAP_NHAT_GIOHANG } = req.body;
  console.log("req.body", req.body);

  // Định dạng ngày
  const formattedDate = moment(NGAY_CAP_NHAT_GIOHANG).format(
    "YYYY-MM-DD HH:mm:ss"
  );

  try {
    // Bước 1: Thêm sản phẩm vào giỏ hàng
    const [results] = await connection.execute(
      "INSERT INTO `GIOHANG` (MASANPHAM, MANGUOIDUNG, NGAYCAPNHAT) VALUES (?, ?, ?)",
      [ID_SAN_PHAM, ID_NGUOI_DUNG, formattedDate]
    );

    // Bước 2: Tính tổng số lượng sản phẩm trong giỏ hàng của người dùng
    const [totalResults] = await connection.execute(
      `SELECT COUNT(MASANPHAM) AS totalQuantity
       FROM GIOHANG
       WHERE MANGUOIDUNG = ?`,
      [ID_NGUOI_DUNG]
    );

    // Bước 3: Trả về phản hồi với tổng số sản phẩm trong giỏ hàng
    const totalQuantity = totalResults[0].totalQuantity;

    res.status(201).json({
      EM: "Thêm vào giỏ hàng thành công",
      EC: 1,
      DT: results,
      totalQuantity: totalQuantity, // Trả về tổng số sản phẩm trong giỏ hàng
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ EM: "Lỗi hệ thống", EC: -1 });
  }
};

// 3. Cập nhật số lượng sản phẩm trong giỏ hàng
const removeSingleProductFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const [results] = await connection.execute(
      "DELETE FROM `GIOHANG` WHERE MANGUOIDUNG = ? AND MASANPHAM = ? LIMIT 1",
      [userId, productId]
    );

    if (results.affectedRows > 0) {
      return res.status(200).json({
        EM: "Xóa 1 sản phẩm khỏi giỏ hàng thành công",
        EC: 1,
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy sản phẩm trong giỏ hàng để xóa",
        EC: 0,
      });
    }
  } catch (error) {
    console.error("Error removing product:", error);
    return res.status(500).json({
      EM: "Lỗi hệ thống khi xóa sản phẩm",
      EC: -1,
    });
  }
};

const addSingleProductToCart = async (req, res) => {
  const { userId, productId, updateDate } = req.body;

  // Sử dụng moment để chuyển đổi updateDate thành định dạng 'YYYY-MM-DD HH:mm:ss'
  const formattedUpdateDate = moment(updateDate).format("YYYY-MM-DD HH:mm:ss");

  try {
    const [results] = await connection.execute(
      "INSERT INTO `GIOHANG` (MANGUOIDUNG, MASANPHAM, NGAYCAPNHAT) VALUES (?, ?, ?)",
      [userId, productId, formattedUpdateDate]
    );

    return res.status(200).json({
      EM: "Thêm sản phẩm vào giỏ hàng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      EM: "Lỗi hệ thống khi thêm sản phẩm vào giỏ hàng",
      EC: -1,
    });
  }
};

// Xóa một loại sản phẩm khỏi giỏ hàng của người dùng
const deleteGioHang = async (req, res) => {
  const { userId, productId } = req.body; // Lấy userId và productId từ tham số URL

  try {
    const [results] = await connection.execute(
      "DELETE FROM `GIO_HANG` WHERE ID_NGUOI_DUNG = ? AND ID_SAN_PHAM = ?",
      [userId, productId]
    );

    // Kiểm tra xem có bản ghi nào bị xóa không
    if (results.affectedRows === 0) {
      return res.status(404).json({
        EM: "Sản phẩm không tồn tại trong giỏ hàng của người dùng",
        EC: 0,
      });
    }

    res.status(200).json({
      EM: "Xóa sản phẩm khỏi giỏ hàng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ EM: "Lỗi hệ thống", EC: -1 });
  }
};

// Lấy tất cả sản phẩm trong giỏ hàng của 1 người dùng
const getCartProductsByUser = async (req, res) => {
  const userId = req.params.id;
  console.log("userId", userId);
  try {
    const [results] = await connection.execute(
      `
     SELECT 
        MIN(gh.MAGIOHANG) as MAGIOHANG,
        sp.MASANPHAM, 
        sp.TENSANPHAM, 
        sp.GIA, 
        sp.HINHANHSANPHAM, 
        sp.MOTA AS MOTA_SANPHAM,
        sp.TRANGTHAISANPHAM, 
        sp.SOLUONG AS SOLUONG_KHO,
        dm.TENLOAISANPHAM,
        COUNT(*) AS SOLUONG_GIOHANG,
        MAX(gh.NGAYCAPNHAT) AS NGAYCAPNHAT
      FROM GIOHANG gh
      JOIN SANPHAM sp ON gh.MASANPHAM = sp.MASANPHAM
      LEFT JOIN DANHMUCSANPHAM dm ON sp.MALOAISANPHAM = dm.MALOAISANPHAM
      WHERE gh.MANGUOIDUNG = ? 
        AND sp.TRANGTHAISANPHAM = 'Đang hoạt động'
      GROUP BY 
        sp.MASANPHAM, 
        sp.TENSANPHAM, 
        sp.GIA, 
        sp.HINHANHSANPHAM, 
        sp.MOTA, 
        sp.TRANGTHAISANPHAM, 
        sp.SOLUONG, 
        dm.TENLOAISANPHAM

    `,
      [userId]
    );

    if (results.length === 0) {
      return res.status(200).json({
        EM: "Giỏ hàng của người dùng trống hoặc không tồn tại",
        EC: 1,
        DT: [],
      });
    }

    // Tính tổng số lượng sản phẩm
    const [totalResults] = await connection.execute(
      `SELECT COUNT(MASANPHAM) AS totalQuantity
       FROM GIOHANG 
       WHERE MANGUOIDUNG = ?`,
      [userId]
    );

    const totalQuantity = totalResults[0].totalQuantity;

    // Tính tổng tiền
    const totalAmount = results.reduce((total, item) => {
      return total + item.GIA * item.SOLUONG_GIOHANG;
    }, 0);

    return res.status(200).json({
      EM: "Lấy thông tin giỏ hàng thành công",
      EC: 1,
      DT: results,
      TOTAL_AMOUNT: totalAmount,
      totalQuantity,
    });
  } catch (error) {
    console.error("Error getting cart products:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy giỏ hàng",
      EC: 0,
      DT: [],
    });
  }
};

// tổng số lượng sản phẩm của 1 người dùng trong giỏ hàng
const getCartTotalQuantity = async (req, res) => {
  const userId = req.params.id; // Lấy ID người dùng từ tham số đường dẫn

  try {
    // Truy vấn số lượng sản phẩm trong giỏ hàng của người dùng
    const [results] = await connection.execute(
      `
      SELECT COUNT(ID_SAN_PHAM) AS totalQuantity
      FROM GIO_HANG
      WHERE ID_NGUOI_DUNG = ?
      `,
      [userId]
    );

    if (results.length > 0) {
      return res.status(200).json({
        EM: "Lấy tổng số lượng sản phẩm trong giỏ hàng thành công",
        EC: 1,
        DT: results[0].totalQuantity, // Trả về tổng số lượng sản phẩm
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy giỏ hàng của người dùng",
        EC: 0,
        DT: 0, // Nếu không có sản phẩm, trả về 0
      });
    }
  } catch (error) {
    console.error("Error getting total cart quantity:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy tổng số lượng sản phẩm",
      EC: 0,
      DT: 0,
    });
  }
};

module.exports = {
  getGioHang,
  createGioHang,
  addSingleProductToCart,
  removeSingleProductFromCart,
  deleteGioHang,
  getCartProductsByUser,
  getCartTotalQuantity,
};
