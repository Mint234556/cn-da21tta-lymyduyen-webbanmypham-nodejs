const pool = require("../../config/database");
const getAllDanhMucSanPham = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM DANHMUCSANPHAM");
    const results = rows;
    return res.status(200).json({
      EM: "Lấy tất cả danh mục thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};
const getAllDanhMucSanPhamUse = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM DANHMUCSANPHAM WHERE TRANG_THAI_DANH_MUC ='Đang hoạt động'",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        EM: "Danh mục không tồn tại",
        EC: -1,
        DT: [],
      });
    }
    const result = rows;
    return res.status(200).json({
      EM: "Lấy thông tin danh mục thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};
const getDanhMucSanPhamById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM DANHMUCSANPHAM WHERE MALOAISANPHAM = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        EM: "Danh mục không tồn tại",
        EC: -1,
        DT: [],
      });
    }
    const result = rows[0];
    return res.status(200).json({
      EM: "Lấy thông tin danh mục thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};
const createDanhMucSanPham = async (req, res) => {
  const { TENLOAISANPHAM, MOTA } = req.body; // Sử dụng đúng tên cột trong bảng
  try {
    const TRANG_THAI_DANH_MUC = "Đang hoạt động";
    const [result] = await pool.query(
      "INSERT INTO DANHMUCSANPHAM (TENLOAISANPHAM, MOTA ,TRANG_THAI_DANH_MUC) VALUES (?, ?,?)", // Thay đổi bảng và cột tương ứng
      [TENLOAISANPHAM, MOTA, TRANG_THAI_DANH_MUC]
    );
    return res.status(201).json({
      EM: "Tạo danh mục sản phẩm thành công",
      EC: 1,
      DT: {
        MALOAISANPHAM: result.insertId, // Trả về ID của danh mục vừa được tạo
        TENLOAISANPHAM,
        MOTA,
        TRANG_THAI_DANH_MUC,
      },
    });
  } catch (error) {
    console.error("Error in createDanhMucSanPham:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const updateDanhMucSanPham = async (req, res) => {
  const { id } = req.params; // Lấy ID từ tham số URL
  const { TENLOAISANPHAM, MOTA, TRANG_THAI_DANH_MUC } = req.body; // Sử dụng đúng tên cột trong bảng
  try {
    const [result] = await pool.query(
      "UPDATE DANHMUCSANPHAM SET TENLOAISANPHAM = ?, MOTA = ?, TRANG_THAI_DANH_MUC =? WHERE MALOAISANPHAM = ?", // Cập nhật bảng và cột tương ứng
      [TENLOAISANPHAM, MOTA, TRANG_THAI_DANH_MUC, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Danh mục không tồn tại",
        EC: -1,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Cập nhật danh mục sản phẩm thành công",
      EC: 1,
      DT: {
        MALOAISANPHAM: id,
        TENLOAISANPHAM,
        MOTA,
        TRANG_THAI_DANH_MUC,
      },
    });
  } catch (error) {
    console.error("Error in updateDanhMucSanPham:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const deleteDanhMucSanPham = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM DANHMUCSANPHAM WHERE MALOAISANPHAM = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Danh mục không tồn tại",
        EC: -1,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Xóa danh mục thành công",
      EC: 1,
      DT: [],
    });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

module.exports = {
  getAllDanhMucSanPham,
  getDanhMucSanPhamById,
  createDanhMucSanPham,
  updateDanhMucSanPham,
  deleteDanhMucSanPham,
  getAllDanhMucSanPhamUse,
};
