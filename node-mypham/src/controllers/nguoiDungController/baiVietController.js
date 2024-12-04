const connection = require("../../config/database"); // Đảm bảo `connection` được import từ tệp kết nối cơ sở dữ liệu của bạn

const getBaiViet = async (req, res) => {
  try {
    const [results] = await connection.execute("SELECT * FROM `BLOGS`");
    res.status(200).json({
      EM: "Lấy danh sách bài viết thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ EM: "Lỗi hệ thống", EC: -1 });
  }
};

const createBaiViet = async (req, res) => {
  const {
    BLOG_TITLE,
    BLOG_CONTENT,
    BLOG_IMAGE_URL,
    BLOG_AUTHOR,
    CREATED_AT,
    BLOG_STATUS,
  } = req.body;

  try {
    const [results] = await connection.execute(
      "INSERT INTO `BLOGS` (BLOG_TITLE, BLOG_CONTENT, BLOG_IMAGE_URL, BLOG_AUTHOR, CREATED_AT, BLOG_STATUS) VALUES (?, ?, ?, ?, ?, ?)",
      [
        BLOG_TITLE,
        BLOG_CONTENT,
        BLOG_IMAGE_URL,
        BLOG_AUTHOR,
        CREATED_AT,
        BLOG_STATUS,
      ]
    );
    res.status(201).json({
      EM: "Thêm bài viết thành công",
      EC: 1,
      DT: {
        BLOG_ID: results.insertId,
        BLOG_TITLE,
        BLOG_CONTENT,
        BLOG_IMAGE_URL,
        BLOG_AUTHOR,
        CREATED_AT,
        BLOG_STATUS,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ EM: "Lỗi hệ thống", EC: -1 });
  }
};

const updateBaiViet = async (req, res) => {
  const { id } = req.params;
  const {
    BLOG_TITLE,
    BLOG_CONTENT,
    BLOG_IMAGE_URL,
    BLOG_AUTHOR,
    CREATED_AT,
    BLOG_STATUS,
  } = req.body;

  try {
    const [results] = await connection.execute(
      "UPDATE `BLOGS` SET BLOG_TITLE = ?, BLOG_CONTENT = ?, BLOG_IMAGE_URL = ?, BLOG_AUTHOR = ?, CREATED_AT = ?, BLOG_STATUS = ? WHERE BLOG_ID = ?",
      [
        BLOG_TITLE,
        BLOG_CONTENT,
        BLOG_IMAGE_URL,
        BLOG_AUTHOR,
        CREATED_AT,
        BLOG_STATUS,
        id,
      ]
    );
    res.status(200).json({
      EM: "Cập nhật bài viết thành công",
      EC: 1,
      DT: {
        BLOG_ID: id,
        BLOG_TITLE,
        BLOG_CONTENT,
        BLOG_IMAGE_URL,
        BLOG_AUTHOR,
        CREATED_AT,
        BLOG_STATUS,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ EM: "Lỗi hệ thống", EC: -1 });
  }
};

const deleteBaiViet = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await connection.execute(
      "DELETE FROM `BLOGS` WHERE BLOG_ID = ?",
      [id]
    );
    res.status(200).json({
      EM: "Xóa bài viết thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ EM: "Lỗi hệ thống", EC: -1 });
  }
};

module.exports = {
  getBaiViet,
  createBaiViet,
  updateBaiViet,
  deleteBaiViet,
};
