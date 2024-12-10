const pool = require("../../config/database"); // Đảm bảo `pool` được import từ tệp kết nối cơ sở dữ liệu của bạn
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const bcrypt = require("bcrypt");

const getAllUser_Admin = async (req, res) => {
  try {
    // Check if the user already exists in the database

    const [rows] = await pool.query("SELECT * FROM NGUOIDUNG ");
    const results = rows;
    return res.status(200).json({
      EM: "Lấy thông tin tất cả người dùng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error in loginUserGoogle:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const getUser_ById = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the user already exists in the database

    const [rows] = await pool.query(
      "SELECT * FROM NGUOIDUNG where MANGUOIDUNG =? ",
      [id]
    );
    const results = rows;
    return res.status(200).json({
      EM: "Lấy thông tin tất cả người dùng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error in loginUserGoogle:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// ---------------------------------------------- updateUserById
const updateUserById_Admin = async (req, res) => {
  const {
    MANGUOIDUNG,
    TENNGUOIDUNG,
    EMAIL,
    DIACHI,
    SODIENTHOAI,
    TRANGTHAINGUOIDUNG,
    MATKHAU,
    VAITRO,
  } = req.body;

  // Kiểm tra xem có đủ ID người dùng để cập nhật hay không
  if (!MANGUOIDUNG) {
    return res.status(400).json({
      EM: "MANGUOIDUNG is missing",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Cập nhật thông tin người dùng trong database
    const [result] = await pool.query(
      `UPDATE nguoidung 
         SET TENNGUOIDUNG = ?, 
             EMAIL = ?, 
             DIACHI = ?, 
             SODIENTHOAI = ?, 
             TRANGTHAINGUOIDUNG = ?, 
             MATKHAU = ?, 
             VAITRO = ? 
         WHERE MANGUOIDUNG = ?`,
      [
        TENNGUOIDUNG,
        EMAIL,
        DIACHI,
        SODIENTHOAI,
        TRANGTHAINGUOIDUNG,
        MATKHAU,
        VAITRO,
        MANGUOIDUNG,
      ]
    );

    // Kiểm tra kết quả cập nhật
    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Người dùng không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Cập nhật thông tin người dùng thành công",
      EC: 1,
      DT: { MANGUOIDUNG },
    });
  } catch (error) {
    console.error("Error in updateUserById_Admin:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const updateUserById_User = async (req, res) => {
  const {
    TENNGUOIDUNG,
    EMAIL,
    DIACHI,
    SODIENTHOAI,
    TRANGTHAINGUOIDUNG,
    MATKHAU,
    VAITRO,
  } = req.body;

  const { id } = req.params; // MANGUOIDUNG

  if (!id) {
    return res.status(400).json({
      EM: "Mã người dùng bị thiếu",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra xem người dùng có tồn tại hay không
    const [existingUser] = await pool.execute(
      "SELECT * FROM NGUOIDUNG WHERE MANGUOIDUNG = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy người dùng",
        EC: 0,
        DT: [],
      });
    }

    // Cập nhật các trường không phải null
    let updateFields = [];
    let updateValues = [];

    if (TENNGUOIDUNG) {
      updateFields.push("TENNGUOIDUNG = ?");
      updateValues.push(TENNGUOIDUNG);
    }
    if (EMAIL) {
      updateFields.push("EMAIL = ?");
      updateValues.push(EMAIL);
    }
    if (DIACHI) {
      updateFields.push("DIACHI = ?");
      updateValues.push(DIACHI);
    }
    if (SODIENTHOAI) {
      updateFields.push("SODIENTHOAI = ?");
      updateValues.push(SODIENTHOAI);
    }
    if (TRANGTHAINGUOIDUNG !== undefined) {
      updateFields.push("TRANGTHAINGUOIDUNG = ?");
      updateValues.push(TRANGTHAINGUOIDUNG);
    }
    if (MATKHAU) {
      updateFields.push("MATKHAU = ?");
      updateValues.push(MATKHAU);
    }
    if (VAITRO) {
      updateFields.push("VAITRO = ?");
      updateValues.push(VAITRO);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        EM: "Không có thông tin cần cập nhật",
        EC: 0,
        DT: [],
      });
    }

    // Cập nhật người dùng
    const updateQuery = `
      UPDATE NGUOIDUNG 
      SET ${updateFields.join(", ")}
      WHERE MANGUOIDUNG = ?
    `;
    updateValues.push(id);

    const [updateResult] = await pool.execute(updateQuery, updateValues);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({
        EM: "Không có gì thay đổi",
        EC: 0,
        DT: [],
      });
    }

    // Trả về thông tin người dùng sau cập nhật
    const [updatedUser] = await pool.execute(
      "SELECT * FROM NGUOIDUNG WHERE MANGUOIDUNG = ?",
      [id]
    );

    return res.status(200).json({
      EM: "Cập nhật thông tin thành công",
      EC: 1,
      DT: updatedUser[0],
    });
  } catch (error) {
    console.error("Lỗi trong updateUserById_User:", error);
    return res.status(500).json({
      EM: `Lỗi hệ thống: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const loginUserGoogle = async (req, res) => {
  const { email, HO_TEN } = req.body;
  console.log("req.body loginUserGoogle", req.body);

  if (!email) {
    return res.status(401).json({
      EM: "Email bị thiếu",
      EC: 401,
      DT: [],
    });
  }

  try {
    // Kiểm tra nếu người dùng đã tồn tại trong cơ sở dữ liệu
    const [rows] = await pool.query("SELECT * FROM NGUOIDUNG WHERE EMAIL = ?", [
      email,
    ]);

    if (rows.length > 0) {
      const user = rows[0];
      console.log(user);

      // Tạo token JWT
      const token = jwt.sign(
        {
          MANGUOIDUNG: user.MANGUOIDUNG,
          EMAIL: user.EMAIL,
          TENNGUOIDUNG: user.TENNGUOIDUNG,
          DIACHI: user.DIACHI,
          SODIENTHOAI: user.SODIENTHOAI,
          TRANGTHAINGUOIDUNG: user.TRANGTHAINGUOIDUNG,
          VAITRO: user.VAITRO,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );

      // Kiểm tra nếu tài khoản bị vô hiệu hóa
      if (user.TRANGTHAINGUOIDUNG === "Ngưng hoạt động") {
        return res.status(403).json({
          EM: "Tài khoản đã bị khóa, không thể đăng nhập",
          EC: 403,
          DT: "Account is disabled",
        });
      }

      return res.status(200).json({
        EM: "Đăng nhập thành công",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: {
            MANGUOIDUNG: user.MANGUOIDUNG,
            EMAIL: user.EMAIL,
            TENNGUOIDUNG: user.TENNGUOIDUNG,
            DIACHI: user.DIACHI,
            SODIENTHOAI: user.SODIENTHOAI,
            TRANGTHAINGUOIDUNG: user.TRANGTHAINGUOIDUNG,
            VAITRO: user.VAITRO,
          },
        },
      });
    } else {
      // Thêm người dùng mới vào cơ sở dữ liệu
      const TRANGTHAINGUOIDUNG = "Đang hoạt động";
      const VAITRO = "user"; // Có thể thay đổi dựa trên logic vai trò của bạn
      const [insertResult] = await pool.query(
        "INSERT INTO NGUOIDUNG (EMAIL, TENNGUOIDUNG, TRANGTHAINGUOIDUNG, VAITRO) VALUES (?, ?, ?, ?)",
        [email, HO_TEN, TRANGTHAINGUOIDUNG, VAITRO]
      );

      const [newUserRows] = await pool.query(
        "SELECT * FROM NGUOIDUNG WHERE EMAIL = ?",
        [email]
      );

      const newUser = newUserRows[0];

      const token = jwt.sign(
        {
          MANGUOIDUNG: newUser.MANGUOIDUNG,
          EMAIL: newUser.EMAIL,
          TENNGUOIDUNG: newUser.TENNGUOIDUNG,
          DIACHI: newUser.DIACHI,
          SODIENTHOAI: newUser.SODIENTHOAI,
          TRANGTHAINGUOIDUNG: newUser.TRANGTHAINGUOIDUNG,
          VAITRO: newUser.VAITRO,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );

      return res.status(200).json({
        EM: "Tạo mới và đăng nhập thành công",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: {
            MANGUOIDUNG: newUser.MANGUOIDUNG,
            EMAIL: newUser.EMAIL,
            TENNGUOIDUNG: newUser.TENNGUOIDUNG,
            DIACHI: newUser.DIACHI,
            SODIENTHOAI: newUser.SODIENTHOAI,
            TRANGTHAINGUOIDUNG: newUser.TRANGTHAINGUOIDUNG,
            VAITRO: newUser.VAITRO,
          },
        },
      });
    }
  } catch (error) {
    console.error("Lỗi trong loginUserGoogle:", error);
    return res.status(500).json({
      EM: `Lỗi hệ thống: ${error.message}`,
      EC: 500,
      DT: [],
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra thông tin đầu vào
  if (!email || !password) {
    return res.status(400).json({
      EM: "Email và mật khẩu không được để trống",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Tìm người dùng dựa trên email
    const [rows] = await pool.query("SELECT * FROM NGUOIDUNG WHERE EMAIL = ?", [
      email,
    ]);

    // Kiểm tra xem người dùng có tồn tại không
    if (rows.length === 0) {
      return res.status(404).json({
        EM: "Người dùng không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    const user = rows[0];

    // So sánh mật khẩu được lưu trữ với mật khẩu nhập vào
    const isPasswordValid = await bcrypt.compare(password, user.MATKHAU);
    if (!isPasswordValid) {
      return res.status(401).json({
        EM: "Mật khẩu không đúng",
        EC: 0,
        DT: [],
      });
    }

    // Kiểm tra trạng thái người dùng
    if (user.TRANGTHAINGUOIDUNG === -1) {
      return res.status(403).json({
        EM: "Tài khoản bị khóa, không thể đăng nhập",
        EC: 0,
        DT: "Account is disabled",
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        MANGUOIDUNG: user.MANGUOIDUNG,
        EMAIL: user.EMAIL,
        TENNGUOIDUNG: user.TENNGUOIDUNG,
        DIACHI: user.DIACHI,
        SODIENTHOAI: user.SODIENTHOAI,
        TRANGTHAINGUOIDUNG: user.TRANGTHAINGUOIDUNG,
        VAITRO: user.VAITRO,
      },
      JWT_SECRET,
      { expiresIn: "5h" }
    );

    // Trả về thông tin đăng nhập
    return res.status(200).json({
      EM: "Đăng nhập thành công",
      EC: 1,
      DT: {
        accessToken: token,
        userInfo: {
          MANGUOIDUNG: user.MANGUOIDUNG,
          EMAIL: user.EMAIL,
          TENNGUOIDUNG: user.TENNGUOIDUNG,
          DIACHI: user.DIACHI,
          SODIENTHOAI: user.SODIENTHOAI,
          TRANGTHAINGUOIDUNG: user.TRANGTHAINGUOIDUNG,
          VAITRO: user.VAITRO,
        },
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const verifyAdmin = async (req, res) => {
  const { token } = req.body;

  // Kiểm tra token
  if (!token) {
    return res.status(401).json({
      EM: "Token is missing",
      EC: 401,
      DT: { isAdmin: false },
    });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Lấy ID người dùng từ token
    const MANGUOIDUNG = decoded.MANGUOIDUNG;

    // Truy vấn thông tin vai trò người dùng
    const [rows] = await pool.query(
      "SELECT VAITRO, TRANGTHAINGUOIDUNG FROM NGUOIDUNG WHERE MANGUOIDUNG = ?",
      [MANGUOIDUNG]
    );

    if (rows.length > 0) {
      const user = rows[0];

      // Kiểm tra trạng thái tài khoản và vai trò
      if (user.TRANGTHAINGUOIDUNG === -1) {
        return res.status(403).json({
          EM: "Tài khoản bị khóa",
          EC: 403,
          DT: { isAdmin: false },
        });
      }

      // Kiểm tra vai trò của người dùng (giả sử `VAITRO` = 'admin' là admin)
      if (user.VAITRO === "admin") {
        return res.status(200).json({
          EM: "Người dùng là admin",
          EC: 200,
          DT: { isAdmin: true }, // Người dùng là admin
        });
      } else {
        return res.status(403).json({
          EM: "Người dùng không phải admin",
          EC: 403,
          DT: { isAdmin: false }, // Người dùng không phải admin
        });
      }
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy người dùng",
        EC: 404,
        DT: { isAdmin: false }, // Không tìm thấy người dùng
      });
    }
  } catch (error) {
    console.error("Error decoding token or querying database:", error);
    return res.status(401).json({
      EM: `Token không hợp lệ: ${error.message}`, // Token không hợp lệ
      EC: 401,
      DT: { isAdmin: false },
    });
  }
};

const registerUser = async (req, res) => {
  const {
    password,
    email,
    fullName,
    phone,
    ADDRESS_ = null, // Mặc định là null nếu không có địa chỉ
    USER_STATUS = "Đang hoạt động", // Mặc định trạng thái là đang hoạt động
    VAITRO = "user", // Mặc định vai trò là "user"
  } = req.body.formData;

  const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu

  // Kiểm tra thông tin bắt buộc
  if (!hashedPassword || !fullName || !phone) {
    return res.status(400).json({
      EM: "Thiếu các trường thông tin bắt buộc",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra email đã tồn tại chưa
    const [existingUser] = await pool.query(
      `SELECT * FROM NGUOIDUNG WHERE EMAIL = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        EM: "Email này đã được đăng ký",
        EC: 0,
        DT: [],
      });
    }

    // Đăng ký người dùng mới
    const [result] = await pool.query(
      `INSERT INTO NGUOIDUNG (
       TENNGUOIDUNG, EMAIL, DIACHI, SODIENTHOAI, TRANGTHAINGUOIDUNG, MATKHAU, VAITRO
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, ADDRESS_, phone, USER_STATUS, hashedPassword, VAITRO]
    );

    // Phản hồi khi đăng ký thành công
    return res.status(200).json({
      EM: "Đăng ký tài khoản thành công",
      EC: 1,
      DT: {
        TENNGUOIDUNG: fullName,
        EMAIL: email,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({
      EM: `Đã xảy ra lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  return res.status(200).json({ message: "Đăng xuất thành công" });
};

const updatePasswordUser = async (req, res) => {
  const { email, newPassword } = req.body;

  // Kiểm tra xem các trường có được điền đầy đủ không
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Tất cả các trường đều yêu cầu" });
  }

  try {
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu vào cơ sở dữ liệu
    const [result] = await pool.execute(
      "UPDATE NGUOIDUNG SET MATKHAU = ?, UPDATED_AT = NOW() WHERE EMAIL = ?",
      [hashedPassword, email]
    );

    // Kiểm tra xem việc cập nhật có thành công không
    if (result.affectedRows > 0) {
      return res.status(200).json({
        EM: "Cập nhật mật khẩu thành công",
        EC: 1,
        DT: [],
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy người dùng với email này",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật mật khẩu",
      EC: 0,
      DT: [],
    });
  }
};

module.exports = {
  loginUserGoogle,
  verifyAdmin,
  logoutUser,
  updateUserById_Admin,
  getAllUser_Admin,
  getUser_ById,
  updateUserById_User,
  updatePasswordUser,
  registerUser,
  loginUser,
};
