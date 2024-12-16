const connection = require("../../config/database.js");
const moment = require("moment");
// Lấy danh sách sản phẩm
const getSAN_PHAM = async (req, res) => {
  try {
    // Thực hiện truy vấn lấy tất cả sản phẩm và thông tin loại sản phẩm từ bảng SANPHAM và DANHMUCSANPHAM
    const [results] = await connection.execute(`
      SELECT 
        SANPHAM.MASANPHAM, 
        SANPHAM.MALOAISANPHAM, 
        SANPHAM.TENSANPHAM, 
        SANPHAM.MOTA AS MOTA_SANPHAM, 
        SANPHAM.GIA, 
        SANPHAM.SOLUONG, 
        SANPHAM.HINHANHSANPHAM, 
        SANPHAM.CREATED_AT_SP, 
        SANPHAM.UPDATED_AT_SP,
        SANPHAM.TRANGTHAISANPHAM,
        DANHMUCSANPHAM.TENLOAISANPHAM
      FROM SANPHAM
      INNER JOIN DANHMUCSANPHAM ON SANPHAM.MALOAISANPHAM = DANHMUCSANPHAM.MALOAISANPHAM
      ORDER BY SANPHAM.CREATED_AT_SP DESC
    `);

    return res.status(200).json({
      EM: "Xem thông tin sản phẩm thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting san pham:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

const getSAN_PHAM_Use_ById = async (req, res) => {
  const { id } = req.params; // Lấy id từ tham số URL

  try {
    const [results] = await connection.execute(
      `
      SELECT MASANPHAM, MALOAISANPHAM, TENSANPHAM, MOTA, GIA, SOLUONG, HINHANHSANPHAM, CREATED_AT_SP, UPDATED_AT_SP
      FROM SANPHAM
      WHERE MASANPHAM = ? AND TRANGTHAISANPHAM = 'Đang hoạt động'
      `,
      [id] // Truyền id vào câu truy vấn
    );

    if (results.length === 0) {
      return res.status(404).json({
        EM: "Sản phẩm không tìm thấy hoặc không còn hoạt động",
        EC: 0,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Xem thông tin sản phẩm thành công",
      EC: 1,
      DT: results[0], // Chỉ trả về sản phẩm đầu tiên (nếu có)
    });
  } catch (error) {
    console.error("Error getting san pham by id:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

const getSAN_PHAM_Use = async (req, res) => {
  try {
    const [results] = await connection.execute(`
      SELECT MASANPHAM, MALOAISANPHAM, TENSANPHAM, MOTA, GIA, SOLUONG, HINHANHSANPHAM, CREATED_AT_SP, UPDATED_AT_SP
      FROM SANPHAM
      WHERE TRANGTHAISANPHAM = 'Đang hoạt động'
    `);

    return res.status(200).json({
      EM: "Xem thông tin sản phẩm thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting san pham:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

//Search theo sản phẩm
const getSAN_PHAM_Search = async (req, res) => {
  const { query } = req.query; // Nhận từ khóa tìm kiếm từ frontend
  console.log("query", query);
  if (!query) {
    return res.status(400).json({
      EM: "Vui lòng cung cấp từ khóa tìm kiếm",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Truy vấn cơ sở dữ liệu với từ khóa tìm kiếm, tìm kiếm trong TENSANPHAM, MOTA và HINHANHSANPHAM
    const [results] = await connection.execute(
      `
      SELECT MASANPHAM, MALOAISANPHAM, TENSANPHAM, MOTA, GIA, SOLUONG, HINHANHSANPHAM, CREATED_AT_SP, UPDATED_AT_SP
      FROM SANPHAM
      WHERE TRANGTHAISANPHAM = 'Đang hoạt động' 
      AND (TENSANPHAM LIKE ? OR MOTA LIKE ? OR HINHANHSANPHAM LIKE ?)
      LIMIT 5
      `,
      [`%${query}%`, `%${query}%`, `%${query}%`] // Sử dụng từ khóa tìm kiếm với LIKE
    );

    return res.status(200).json({
      EM: "Xem thông tin sản phẩm thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting san pham:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

//lấy tất cả sản phẩm ĐANG HOẠT ĐỘNG = NỮ

//lấy 2 sản phẩm mới thêm vào
const getLatest2Products = async (req, res) => {
  try {
    // Truy vấn 2 sản phẩm mới nhất theo CREATED_AT_SP
    const [results] = await connection.execute(`
      SELECT MASANPHAM, MALOAISANPHAM, TENSANPHAM, MOTA, GIA, SOLUONG, HINHANHSANPHAM, CREATED_AT_SP, UPDATED_AT_SP
      FROM SANPHAM
      WHERE TRANGTHAISANPHAM = 'Đang hoạt động'
      ORDER BY CREATED_AT_SP DESC
      LIMIT 2
    `);

    return res.status(200).json({
      EM: "Xem thông tin sản phẩm thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

const get_5CheapestProducts = async (req, res) => {
  try {
    // Truy vấn 5 sản phẩm có giá thấp nhất theo GIA
    const [results] = await connection.execute(`
      SELECT MASANPHAM, MALOAISANPHAM, TENSANPHAM, MOTA, GIA, SOLUONG, HINHANHSANPHAM, CREATED_AT_SP, UPDATED_AT_SP
      FROM SANPHAM
      WHERE TRANGTHAISANPHAM = 'Đang hoạt động'
      ORDER BY GIA ASC
      LIMIT 5
    `);

    return res.status(200).json({
      EM: "Xem 5 sản phẩm giá rẻ nhất thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting cheapest san pham:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin sản phẩm giá rẻ nhất",
      EC: 0,
      DT: [],
    });
  }
};

const getTop5BestSellingProducts = async (req, res) => {
  try {
    // Truy vấn 5 sản phẩm bán chạy nhất dựa vào tổng số lượng bán
    const [results] = await connection.execute(`
      SELECT sp.MASANPHAM, sp.MALOAISANPHAM, sp.TENSANPHAM, sp.GIA, sp.MOTA, sp.SOLUONG, sp.HINHANHSANPHAM, sp.CREATED_AT_SP, sp.UPDATED_AT_SP, 
             SUM(oi.QUANTITY) AS total_sold
      FROM SANPHAM sp
      JOIN ORDER_ITEMS oi ON sp.MASANPHAM = oi.PRODUCT_ID
      WHERE sp.TRANGTHAISANPHAM = 'Đang hoạt động'
      GROUP BY sp.MASANPHAM
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    return res.status(200).json({
      EM: "Xem 5 sản phẩm bán chạy nhất thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting best-selling products:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin sản phẩm bán chạy nhất",
      EC: 0,
      DT: [],
    });
  }
};

// Lấy 5 sản phẩm có giá tiền cao nhất
const getTopExpensiveProducts = async (req, res) => {
  try {
    const [results] = await connection.execute(`
      SELECT sp.MASANPHAM, sp.MALOAISANPHAM, sp.TENSANPHAM, sp.GIA, sp.MOTA, sp.SOLUONG, sp.HINHANHSANPHAM, sp.CREATED_AT_SP, sp.UPDATED_AT_SP,
             dm.TENLOAISANPHAM
      FROM SANPHAM sp
      JOIN DANHMUCSANPHAM dm ON sp.MALOAISANPHAM = dm.MALOAISANPHAM
      WHERE sp.TRANGTHAISANPHAM = 'Đang hoạt động'
      ORDER BY sp.GIA DESC
      LIMIT 5
    `);

    return res.status(200).json({
      EM: "Xem 5 sản phẩm có giá cao nhất thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting top expensive products:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin sản phẩm",
      EC: 0,
      DT: [],
    });
  }
};

// Tạo sản phẩm mới
const createSAN_PHAM = async (req, res) => {
  const { MALOAISANPHAM, TENSANPHAM, MOTA, GIA, SOLUONG, TRANGTHAISANPHAM } =
    req.body;
  const HINHANHSANPHAM = req.file ? req.file.filename : null;
  try {
    // Thực hiện truy vấn INSERT để thêm sản phẩm mới vào bảng SANPHAM
    const [result] = await connection.execute(
      `
     INSERT INTO SANPHAM 
(MALOAISANPHAM, TENSANPHAM, MOTA, GIA, SOLUONG, HINHANHSANPHAM, CREATED_AT_SP, UPDATED_AT_SP, TRANGTHAISANPHAM)
VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)

      `,
      [
        MALOAISANPHAM,
        TENSANPHAM,
        MOTA,
        GIA,
        SOLUONG,
        HINHANHSANPHAM,
        TRANGTHAISANPHAM,
      ]
    );

    // Trả về thông tin sản phẩm mới đã được tạo
    return res.status(201).json({
      EM: "Thêm sản phẩm thành công",
      EC: 1,
      DT: {
        MASANPHAM: result.insertId,
        MALOAISANPHAM: MALOAISANPHAM,
        TENSANPHAM: TENSANPHAM,
        MOTA: MOTA,
        GIA: GIA,
        SOLUONG: SOLUONG,
        HINHANHSANPHAM: HINHANHSANPHAM,
        TRANGTHAISANPHAM: TRANGTHAISANPHAM,
        CREATED_AT_SP: new Date().toISOString(), // Thêm thời gian tạo
        UPDATED_AT_SP: new Date().toISOString(), // Thêm thời gian cập nhật
      },
    });
  } catch (error) {
    console.error("Error creating san pham:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi thêm sản phẩm",
      EC: 0,
      DT: [],
    });
  }
};

// Cập nhật sản phẩm
const updateSAN_PHAM = async (req, res) => {
  const { id } = req.params; // Lấy MASANPHAM từ URL
  const updatedFields = req.body;
  const HINHANHSANPHAM = req.file ? req.file.filename : null;
  const MASANPHAM = id;
  try {
    // Nếu không có dữ liệu gửi lên để cập nhật
    if (!MASANPHAM || Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        EM: "Dữ liệu cập nhật không hợp lệ",
        EC: 0,
        DT: [],
      });
    }

    // Nếu có file ảnh, thêm vào danh sách các trường cần cập nhật
    if (HINHANHSANPHAM) {
      updatedFields.HINHANHSANPHAM = HINHANHSANPHAM;
    }

    // Thêm thời gian cập nhật vào trường động
    updatedFields.UPDATED_AT_SP = moment().format("YYYY-MM-DD HH:mm:ss");
    // Tạo câu truy vấn động
    const updates = Object.keys(updatedFields)
      .map((key) => `${key} = ?`) // Ghép các cặp `key = ?`
      .join(", ");

    const values = Object.values(updatedFields); // Giá trị tương ứng

    // Thực hiện câu lệnh UPDATE
    const [result] = await connection.execute(
      `
      UPDATE SANPHAM 
      SET ${updates} 
      WHERE MASANPHAM = ?
      `,
      [...values, MASANPHAM]
    );

    // Kiểm tra nếu không có dòng nào bị ảnh hưởng
    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Sản phẩm không tìm thấy hoặc không có thay đổi",
        EC: 0,
        DT: [],
      });
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      EM: "Cập nhật sản phẩm thành công",
      EC: 1,
      DT: {
        MASANPHAM,
        ...updatedFields, // Trả về thông tin đã cập nhật
      },
    });
  } catch (error) {
    console.error("Error updating san pham:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật sản phẩm",
      EC: 0,
      DT: [],
    });
  }
};

// Xóa sản phẩm

const deleteSAN_PHAM = async (req, res) => {
  const { id } = req.params; // Lấy MASANPHAM từ tham số URL
  console.log("MASANPHAM", id);
  try {
    // Bước 1: Lấy thông tin sản phẩm để lấy tên hình ảnh
    const [product] = await connection.execute(
      `
      SELECT HINHANHSANPHAM FROM SANPHAM WHERE MASANPHAM = ?
      `,
      [id]
    );

    // Kiểm tra xem sản phẩm có tồn tại không
    if (product.length === 0) {
      return res.status(404).json({
        EM: "Sản phẩm không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    // Lấy tên hình ảnh từ sản phẩm
    const imageUrl = product[0].HINHANHSANPHAM;

    // Bước 2: Xóa sản phẩm khỏi cơ sở dữ liệu
    const [deleteResult] = await connection.execute(
      `
      DELETE FROM SANPHAM WHERE MASANPHAM = ?
      `,
      [id]
    );

    // Kiểm tra nếu không có sản phẩm nào bị xóa
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        EM: "Sản phẩm không tồn tại hoặc đã được xóa",
        EC: 0,
        DT: [],
      });
    }

    // Bước 3: Xóa hình ảnh nếu cần (nếu bạn muốn xóa file hình ảnh thực tế từ server)
    // Ví dụ, nếu bạn lưu trữ hình ảnh trên server, bạn có thể xóa file ở đây:
    // if (imageUrl) {
    //   const fs = require('fs');
    //   const path = require('path');
    //   const imagePath = path.join(__dirname, 'public', imageUrl);
    //   fs.unlink(imagePath, (err) => {
    //     if (err) {
    //       console.error('Lỗi khi xóa hình ảnh:', err);
    //     }
    //   });
    // }

    // Trả về thông báo thành công
    return res.status(200).json({
      EM: "Xóa sản phẩm thành công",
      EC: 1,
      DT: [],
    });
  } catch (error) {
    console.error("Error deleting san pham:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi xóa sản phẩm",
      EC: 0,
      DT: [],
    });
  }
};

module.exports = {
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
};
