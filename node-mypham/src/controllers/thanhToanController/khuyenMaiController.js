// controllers/sanPhamController/khuyenMaiController.js
const moment = require("moment"); // Cài đặt nếu chưa: npm install moment

const connection = require("../../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả khuyến mãi
const getAllKhuyenMai = async (req, res) => {
  try {
    // Sử dụng ORDER BY MAKHUYENMAI DESC để sắp xếp theo thứ tự giảm dần
    const [results] = await connection.execute(
      "SELECT * FROM KHUYENMAI ORDER BY MAKHUYENMAI DESC"
    );
    return res.status(200).json({
      EM: "Lấy danh sách khuyến mãi thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting all khuyen mai:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy danh sách khuyến mãi",
      EC: 0,
      DT: [],
    });
  }
};

// Lấy khuyến mãi theo CODE
const getKhuyenMaiByCODE = async (req, res) => {
  const { CODE } = req.params;
  console.log("CODE", CODE);

  try {
    const [result] = await connection.execute(
      "SELECT * FROM KHUYENMAI WHERE CODE = ?",
      [CODE]
    );

    if (result.length === 0) {
      return res.status(200).json({
        EM: "Khuyến mãi không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    // Lấy khuyến mãi từ kết quả
    const khuyenMai = result[0];

    // Kiểm tra HANSUDUNG (hết hạn)
    const currentDate = new Date();
    const expiryDate = new Date(khuyenMai.HANSUDUNG);

    if (expiryDate < currentDate) {
      return res.status(200).json({
        EM: "Khuyến mãi đã hết hạn",
        EC: 0,
        DT: [],
      });
    }

    // Kiểm tra MOTA (Đã được sử dụng)
    if (khuyenMai.MOTA === "Đã được sử dụng") {
      return res.status(200).json({
        EM: "Khuyến mãi đã được sử dụng",
        EC: 0,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Lấy khuyến mãi thành công",
      EC: 1,
      DT: khuyenMai,
    });
  } catch (error) {
    console.error("Error getting khuyen mai by CODE:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy khuyến mãi",
      EC: 0,
      DT: [],
    });
  }
};

// Tạo mới khuyến mãi
const createKhuyenMai = async (req, res) => {
  const { CODE, MOTA, HANSUDUNG, SOTIENGIAM } = req.body;

  try {
    const [result] = await connection.execute(
      "INSERT INTO KHUYENMAI (CODE, MOTA, HANSUDUNG ,SOTIENGIAM) VALUES (?, ?, ?,?)",
      [CODE, MOTA, HANSUDUNG, SOTIENGIAM]
    );

    return res.status(201).json({
      EM: "Tạo khuyến mãi thành công",
      EC: 1,
      DT: {
        MAKHUYENMAI: result.insertId,
        CODE,
        MOTA,
        HANSUDUNG,
        SOTIENGIAM,
      },
    });
  } catch (error) {
    console.error("Error creating khuyen mai:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi tạo khuyến mãi",
      EC: 0,
      DT: [],
    });
  }
};

// Cập nhật khuyến mãi (dynamic)
const updateKhuyenMai = async (req, res) => {
  const { MAKHUYENMAI } = req.params;
  let fieldsToUpdate = req.body; // Các trường cần cập nhật từ body

  try {
    // Kiểm tra nếu không có trường nào để cập nhật
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        EM: "Không có dữ liệu để cập nhật",
        EC: 0,
        DT: [],
      });
    }

    // Chuyển đổi định dạng datetime cho HANSUDUNG nếu tồn tại
    if (fieldsToUpdate.HANSUDUNG) {
      fieldsToUpdate.HANSUDUNG = moment(fieldsToUpdate.HANSUDUNG).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }

    // Tạo truy vấn động
    const updates = Object.keys(fieldsToUpdate)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(fieldsToUpdate);

    // Thêm MAKHUYENMAI vào cuối mảng values
    values.push(MAKHUYENMAI);

    const [result] = await connection.execute(
      `UPDATE KHUYENMAI SET ${updates} WHERE MAKHUYENMAI = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Khuyến mãi không tồn tại hoặc không có thay đổi",
        EC: 0,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Cập nhật khuyến mãi thành công",
      EC: 1,
      DT: fieldsToUpdate,
    });
  } catch (error) {
    console.error("Error updating khuyen mai:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật khuyến mãi",
      EC: 0,
      DT: [],
    });
  }
};

// Xóa khuyến mãi
const deleteKhuyenMai = async (req, res) => {
  const { MAKHUYENMAI } = req.params;

  try {
    const [result] = await connection.execute(
      "DELETE FROM KHUYENMAI WHERE MAKHUYENMAI = ?",
      [MAKHUYENMAI]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Khuyến mãi không tồn tại hoặc đã bị xóa",
        EC: 0,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Xóa khuyến mãi thành công",
      EC: 1,
      DT: [],
    });
  } catch (error) {
    console.error("Error deleting khuyen mai:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi xóa khuyến mãi",
      EC: 0,
      DT: [],
    });
  }
};

module.exports = {
  getAllKhuyenMai,
  getKhuyenMaiByCODE,
  createKhuyenMai,
  updateKhuyenMai,
  deleteKhuyenMai,
};
