// controllers/sanPhamController/khuyenMaiController.js

const connection = require("../../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả khuyến mãi
const getAllKhuyenMai = async (req, res) => {
  try {
    const [results] = await connection.execute("SELECT * FROM KHUYENMAI");
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

// Lấy khuyến mãi theo ID
const getKhuyenMaiById = async (req, res) => {
  const { MAKHUYENMAI } = req.params;

  try {
    const [result] = await connection.execute(
      "SELECT * FROM KHUYENMAI WHERE MAKHUYENMAI = ?",
      [MAKHUYENMAI]
    );

    if (result.length === 0) {
      return res.status(404).json({
        EM: "Khuyến mãi không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Lấy khuyến mãi thành công",
      EC: 1,
      DT: result[0],
    });
  } catch (error) {
    console.error("Error getting khuyen mai by ID:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy khuyến mãi",
      EC: 0,
      DT: [],
    });
  }
};

// Tạo mới khuyến mãi
const createKhuyenMai = async (req, res) => {
  const { CODE, MOTA, HANSUDUNG } = req.body;

  try {
    const [result] = await connection.execute(
      "INSERT INTO KHUYENMAI (CODE, MOTA, HANSUDUNG) VALUES (?, ?, ?)",
      [CODE, MOTA, HANSUDUNG]
    );

    return res.status(201).json({
      EM: "Tạo khuyến mãi thành công",
      EC: 1,
      DT: {
        MAKHUYENMAI: result.insertId,
        CODE,
        MOTA,
        HANSUDUNG,
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

// Cập nhật khuyến mãi
const updateKhuyenMai = async (req, res) => {
  const { MAKHUYENMAI } = req.params;
  const { CODE, MOTA, HANSUDUNG } = req.body;

  try {
    const [result] = await connection.execute(
      "UPDATE KHUYENMAI SET CODE = ?, MOTA = ?, HANSUDUNG = ? WHERE MAKHUYENMAI = ?",
      [CODE, MOTA, HANSUDUNG, MAKHUYENMAI]
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
      DT: {
        MAKHUYENMAI,
        CODE,
        MOTA,
        HANSUDUNG,
      },
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
  getKhuyenMaiById,
  createKhuyenMai,
  updateKhuyenMai,
  deleteKhuyenMai,
};
