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
      "INSERT INTO `GIO_HANG` (ID_SAN_PHAM, ID_NGUOI_DUNG, NGAY_CAP_NHAT_GIOHANG) VALUES (?, ?, ?)",
      [ID_SAN_PHAM, ID_NGUOI_DUNG, formattedDate]
    );

    // Bước 2: Tính tổng số lượng sản phẩm trong giỏ hàng của người dùng
    const [totalResults] = await connection.execute(
      `SELECT COUNT(ID_SAN_PHAM) AS totalQuantity
       FROM GIO_HANG
       WHERE ID_NGUOI_DUNG = ?`,
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
      "DELETE FROM `GIO_HANG` WHERE ID_NGUOI_DUNG = ? AND ID_SAN_PHAM = ? LIMIT 1",
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
      "INSERT INTO `GIO_HANG` (ID_NGUOI_DUNG, ID_SAN_PHAM, NGAY_CAP_NHAT_GIOHANG) VALUES (?, ?, ?)",
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
  const userId = req.params.id; // Lấy userId từ tham số URL

  try {
    const [results] = await connection.execute(
      `
      SELECT 
  cth.ID_SAN_PHAM, 
  sp.TEN_SAN_PHAM, 
  sp.GIA, 
  sp.HINH_ANH_SANPHAM, 
  sp.MO_TA_SAN_PHAM,
  sp.TRANG_THAI_SANPHAM, 
  sp.SO_LUONG_SANPHAM, 
  gt.TEN_GIOI_TINH,
  dm.TEN_DANH_MUC,
  cl.TEN_CHAT_LIEU_,
  th.TEN_THUONG_HIEU,
  COUNT(*) AS TONG_SO_LUONG,  -- Đếm số lượng của sản phẩm
  MAX(cth.NGAY_CAP_NHAT_GIOHANG) AS NGAY_CAP_NHAT_GIOHANG, -- Ngày cập nhật mới nhất

  -- Lấy thông tin từ các bảng PHONG_CACH, MAU_SAC, MUC_DICH_SU_DUNG, và KICH_CO
  MAX(pc.ID_PHUONG_CACH) AS ID_PHUONG_CACH, 
  MAX(pc.TEN_PHONG_CACH) AS TEN_PHONG_CACH, 
  MAX(pc.CREATED_PHONG_CACH) AS CREATED_PHONG_CACH,
  MAX(pc.UPDATE_PHONG_CACH) AS UPDATE_PHONG_CACH,
  MAX(pc.TRANG_THAI_PHONG_CACH) AS TRANG_THAI_PHONG_CACH,

  MAX(ms.MAU_SAC_ID) AS MAU_SAC_ID,
  MAX(ms.TEN_MAU_SAC) AS TEN_MAU_SAC,
  MAX(ms.CREATE_MAU_SAC) AS CREATE_MAU_SAC,
  MAX(ms.UPDATE_MAU_SAC) AS UPDATE_MAU_SAC,
  MAX(ms.TRANG_THAI_MAU_SAC) AS TRANG_THAI_MAU_SAC,

  MAX(md.ID_MUC_DICH_SU_DUNG) AS ID_MUC_DICH_SU_DUNG,
  MAX(md.TEN_MUC_DICH_SU_DUNG) AS TEN_MUC_DICH_SU_DUNG,
  MAX(md.CREATE_MUC_DICH_SU_DUNG) AS CREATE_MUC_DICH_SU_DUNG,
  MAX(md.UPDATE_MUC_DICH_SU_DUNG) AS UPDATE_MUC_DICH_SU_DUNG,
  MAX(md.TRANG_THAI_MUC_DICH_SU_DUNG) AS TRANG_THAI_MUC_DICH_SU_DUNG,

  MAX(kc.ID_KICH_CO) AS ID_KICH_CO,
  MAX(kc.KICH_CO) AS KICH_CO,
  MAX(kc.TRANG_THAI_KICH_CO) AS TRANG_THAI_KICH_CO,
  MAX(kc.CREATED_KICH_CO) AS CREATED_KICH_CO,
  MAX(kc.UPDATE_KICH_CO) AS UPDATE_KICH_CO

FROM GIO_HANG cth
JOIN SAN_PHAM sp ON cth.ID_SAN_PHAM = sp.ID_SAN_PHAM
LEFT JOIN GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU

-- Kết nối với các bảng PHONG_CACH, MAU_SAC, MUC_DICH_SU_DUNG, và KICH_CO qua các bảng kết nối
LEFT JOIN PHONG_CACH_SAN_PHAM pcsp ON sp.ID_SAN_PHAM = pcsp.ID_SAN_PHAM
LEFT JOIN PHONG_CACH pc ON pcsp.ID_PHUONG_CACH = pc.ID_PHUONG_CACH

LEFT JOIN MAU_SAC_SAN_PHAM mssp ON sp.ID_SAN_PHAM = mssp.ID_SAN_PHAM
LEFT JOIN MAU_SAC ms ON mssp.MAU_SAC_ID = ms.MAU_SAC_ID

LEFT JOIN MUC_DICH_SU_DUNG_SAN_PHAM mdssp ON sp.ID_SAN_PHAM = mdssp.ID_SAN_PHAM
LEFT JOIN MUC_DICH_SU_DUNG md ON mdssp.ID_MUC_DICH_SU_DUNG = md.ID_MUC_DICH_SU_DUNG

LEFT JOIN CO_KICH_CO ck ON sp.ID_SAN_PHAM = ck.ID_SAN_PHAM
LEFT JOIN KICH_CO kc ON ck.ID_KICH_CO = kc.ID_KICH_CO

WHERE cth.ID_NGUOI_DUNG = ? AND sp.TRANG_THAI_SANPHAM = 1
GROUP BY cth.ID_SAN_PHAM

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
    // Bước 2: Tính tổng số lượng sản phẩm trong giỏ hàng của người dùng
    const [totalResults] = await connection.execute(
      `SELECT COUNT(ID_SAN_PHAM) AS totalQuantity
       FROM GIO_HANG
       WHERE ID_NGUOI_DUNG = ?`,
      [userId]
    );

    // Bước 3: Trả về phản hồi với tổng số sản phẩm trong giỏ hàng
    const totalQuantity = totalResults[0].totalQuantity;
    // Tính tổng số tiền
    const totalAmount = results.reduce((total, item) => {
      return total + item.GIA * item.TONG_SO_LUONG;
    }, 0);

    return res.status(200).json({
      EM: "Lấy thông tin giỏ hàng thành công",
      EC: 1,
      DT: results,
      TOTAL_AMOUNT: totalAmount, // Trả về tổng số tiền
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
