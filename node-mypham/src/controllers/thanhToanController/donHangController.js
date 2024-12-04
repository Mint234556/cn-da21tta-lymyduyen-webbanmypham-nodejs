const connection = require("../../config/database");
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpStorage = new Map();

// Lấy danh sách đơn hàng
const getDON_HANG = async (req, res) => {
  try {
    // Lấy dữ liệu đơn hàng kèm thông tin thanh toán và người dùng
    const [results] = await connection.execute(`
      SELECT 
        d.MADONHANG, 
        d.MAKHUYENMAI, 
        d.MANGUOIDUNG, 
        d.TRANGTHAI, 
        d.NGAYTHANHTOAN, 
        d.DIACHIDONHANG, 
        d.HINHTHUCTHANHTOAN, 
        d.TONGTIEN, 
        u.TENNGUOIDUNG, 
        u.EMAIL, 
        u.DIACHI, 
        u.SODIENTHOAI, 
        u.TRANGTHAINGUOIDUNG, 
        u.MATKHAU, 
        u.VAITRO
      FROM 
        DON_HANG d
      LEFT JOIN 
        NGUOIDUNG u 
      ON 
        d.MANGUOIDUNG = u.MANGUOIDUNG
      ORDER BY 
        d.NGAYTHANHTOAN DESC
    `);

    return res.status(200).json({
      EM: "Lấy danh sách đơn hàng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting don hang:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

const getDON_HANG_ByIDUser = async (req, res) => {
  try {
    // Lấy ID_NGUOI_DUNG từ tham số của request
    const { id } = req.params;

    // Lấy dữ liệu đơn hàng kèm thông tin thanh toán, người dùng và chi tiết đơn hàng
    const [results] = await connection.execute(
      `
      SELECT 
        d.MADONHANG, 
        d.MAKHUYENMAI, 
        d.MANGUOIDUNG, 
        d.TRANGTHAI, 
        d.NGAYTHANHTOAN, 
        d.DIACHIDONHANG, 
        d.HINHTHUCTHANHTOAN, 
        d.TONGTIEN,
        c.IDCHITIETDONHANG,
        c.MASANPHAM,
        c.MADONHANG AS CHITIET_MADONHANG,
        c.GIASP,
        c.SOLUONGSP,
        c.DANHGIA,
        c.BINHLUAN
      FROM 
        DON_HANG d
      LEFT JOIN 
        CHITIETDONHANG c
      ON 
        d.MADONHANG = c.MADONHANG
      WHERE 
        d.MANGUOIDUNG = ?  -- Lọc theo MANGUOIDUNG
      ORDER BY 
        d.NGAYTHANHTOAN DESC
    `,
      [id]
    ); // Truyền tham số MANGUOIDUNG vào câu truy vấn

    return res.status(200).json({
      EM: "Lấy danh sách đơn hàng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting don hang:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

// Tạo đơn hàng mới
const createDON_HANG = async (req, res) => {
  const {
    idNguoiDung,
    idThanhToan,
    tongTien,
    trangThaiDonHang,
    ghiChuDonHang,
    ID_ODER,
    items,
    email,
    SO_DIEN_THOAI_DON_HANG,
    DIA_CHI_DON_HANG,
  } = req.body;

  console.log("req.body", req.body);

  try {
    // Đảm bảo items luôn là mảng
    const itemsArray = Array.isArray(items) ? items : [items];

    // Tạo đơn hàng
    const ngayTaoDonHang = new Date();
    const [results] = await connection.execute(
      "INSERT INTO DON_HANG (ID_NGUOI_DUNG, ID_THANH_TOAN, TONG_TIEN, TRANG_THAI_DON_HANG, NGAY_TAO_DONHANG, NGAY_CAP_NHAT_DONHANG, ID_ODER, SO_DIEN_THOAI_DON_HANG, DIA_CHI_DON_HANG) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        idNguoiDung,
        idThanhToan,
        tongTien,
        trangThaiDonHang,
        ngayTaoDonHang,
        ngayTaoDonHang,
        ID_ODER,
        SO_DIEN_THOAI_DON_HANG,
        DIA_CHI_DON_HANG,
      ]
    );

    const donHangId = results.insertId;

    // Thêm chi tiết đơn hàng vào bảng CHITIETDONHANG và THEM
    const chiTietDonHangPromises = itemsArray.map(async (item) => {
      const { ID_SAN_PHAM, TONG_SO_LUONG = 1, GIA, DANHGIA, BINHLUAN } = item;
      const giaSanPham = GIA * TONG_SO_LUONG;

      // Thêm vào bảng CHITIETDONHANG
      await connection.execute(
        "INSERT INTO CHITIETDONHANG (MASANPHAM, MADONHANG, GIASP, SOLUONGSP, DANHGIA, BINHLUAN) VALUES (?, ?, ?, ?, ?, ?)",
        [ID_SAN_PHAM, donHangId, giaSanPham, TONG_SO_LUONG, DANHGIA, BINHLUAN]
      );

      // Thêm vào bảng THEM (Giỏ hàng)
      await connection.execute(
        "INSERT INTO THEM (MADONHANG, MASANPHAM, SOLUONGDAT) VALUES (?, ?, ?)",
        [donHangId, ID_SAN_PHAM, TONG_SO_LUONG]
      );
    });

    // Chờ tất cả các chi tiết đơn hàng và giỏ hàng được thêm vào
    await Promise.all(chiTietDonHangPromises);

    // Phản hồi thành công
    return res.json({
      EM: "Thêm đơn hàng, gửi email và xóa giỏ hàng thành công",
      EC: 1,
    });
  } catch (error) {
    console.error("Error creating don hang:", error);
    return res.status(500).json({
      EM: "Lỗi khi thêm đơn hàng hoặc gửi email",
      EC: -1,
    });
  }
};

const updateTrangThaiDonHang = async (req, res) => {
  const { ID_ODER, email, idNguoiDung } = req.body;

  if (!ID_ODER || !email || !idNguoiDung) {
    return res.status(400).json({
      EM: "Vui lòng cung cấp đầy đủ thông tin",
      EC: -1,
    });
  }

  try {
    // Lấy thông tin đơn hàng và chi tiết sản phẩm
    const [orderResults] = await connection.execute(
      "SELECT * FROM DON_HANG WHERE ID_ODER = ? AND ID_NGUOI_DUNG = ?",
      [ID_ODER, idNguoiDung]
    );

    if (orderResults.length === 0) {
      return res.status(404).json({
        EM: "Đơn hàng không tồn tại",
        EC: -1,
      });
    }

    const order = orderResults[0]; // Lấy đơn hàng đầu tiên (vì ID_ODER là duy nhất)
    const trangThaiDonHang = "Đã thanh toán thành công và đang chờ giao hàng";
    const [updateResults] = await connection.execute(
      "UPDATE DON_HANG SET TRANG_THAI_DON_HANG = ?, NGAY_CAP_NHAT_DONHANG = ? WHERE ID_ODER = ?",
      [trangThaiDonHang, new Date(), ID_ODER]
    );

    const [orderDetails] = await connection.execute(
      "SELECT c.ID_SAN_PHAM, c.SO_LUONG_SP, c.GIA_SAN_PHAM_CHI_TIET, p.TEN_SAN_PHAM FROM CHI_TIET_HOA_DON c JOIN SAN_PHAM p ON c.ID_SAN_PHAM = p.ID_SAN_PHAM WHERE c.ID_DON_HANG = ?",
      [order.ID_DON_HANG]
    );

    // Lấy thông tin người dùng
    const [userResults] = await connection.execute(
      "SELECT HO_TEN, EMAIL, DIA_CHI_Provinces,DIA_CHI_Districts,DIA_CHI_Wards, SO_DIEN_THOAI FROM NGUOI_DUNG WHERE ID_NGUOI_DUNG = ?",
      [idNguoiDung]
    );
    console.log("orderDetails", orderDetails);
    if (userResults.length === 0) {
      return res.status(404).json({
        EM: "Người dùng không tồn tại",
        EC: -1,
      });
    }

    const user = userResults[0]; // Lấy thông tin người dùng

    // Chuẩn bị thông tin gửi email
    const orderDetailsFormatted = {
      orderId: order.ID_ODER,
      tongTien: order.TONG_TIEN,
      ngayTaoDonHang: order.NGAY_TAO_DONHANG,
      items: orderDetails.map((item) => ({
        tenSanPham: item.TEN_SAN_PHAM,
        soLuong: item.SO_LUONG_SP,
        giaSanPhamChiTiet: item.GIA_SAN_PHAM_CHI_TIET,
      })),
      user: {
        name: user.HO_TEN,
        email: user.EMAIL,
        address: order.DIA_CHI_DON_HANG,

        phone: order.SO_DIEN_THOAI_DON_HANG,
      },
    };

    // Gọi hàm gửi email
    const emailResult = await sendOrderEmail({
      email,
      orderDetails: orderDetailsFormatted,
    });

    if (emailResult.EC === 1) {
      // Xóa dữ liệu trong bảng GIO_HANG nếu email gửi thành công
      await connection.execute("DELETE FROM GIO_HANG WHERE ID_NGUOI_DUNG = ?", [
        idNguoiDung,
      ]);

      return res.json({
        EM: "Cập nhật trạng thái đơn hàng thành công và đã gửi email",
        EC: 1,
      });
    } else {
      return res.status(500).json({
        EM: "Lỗi khi gửi email",
        EC: -1,
      });
    }
  } catch (error) {
    console.error("Error updating don hang status:", error);
    return res.status(500).json({
      EM: "Lỗi khi cập nhật trạng thái đơn hàng",
      EC: -1,
    });
  }
};

// Hàm gửi email
const sendOrderEmail = async ({ email, orderDetails }) => {
  if (!email || !orderDetails) {
    return {
      EM: "Email và chi tiết đơn hàng là bắt buộc",
      EC: -1,
    };
  }
  const formattedTongTien = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(orderDetails.tongTien);
  // Tạo nội dung email
  const orderMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; padding: 10px 0;">
        <h1 style="color: #007BFF;">Cảm Ơn Bạn Đã Đặt Hàng! PhucShoe2</h1>
        <p style="font-size: 16px; color: #555;">Đơn hàng của bạn đã được ghi nhận thành công.</p>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #007BFF;">Chi Tiết Đơn Hàng</h2>
        <p><strong>Mã Đơn Hàng:</strong> ${orderDetails.orderId}</p>
        <p><strong>Tổng Tiền:</strong> ${formattedTongTien}</p>
        <p><strong>Ngày Đặt:</strong> ${orderDetails.ngayTaoDonHang}</p>
        <h3>Sản Phẩm:</h3>
        <ul>
        ${orderDetails.items
          .map(
            (item) =>
              `<li>${item.tenSanPham} - ${
                item.soLuong
              } x ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.giaSanPhamChiTiet)} </li>`
          )
          .join("")}
        
        </ul>
        <h3>Thông Tin Người Dùng:</h3>
        <p><strong>Họ Tên:</strong> ${orderDetails.user.name}</p>
        <p><strong>Địa Chỉ:</strong> ${orderDetails.user.address}</p>
        <p><strong>Số Điện Thoại:</strong> ${orderDetails.user.phone}</p>
      </div>
      <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; 2024 PhucShoe2. All rights reserved.</p>
      </div>
    </div>
  `;

  // Cấu hình gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_OTP,
      pass: process.env.PASSWORD_OTP,
    },
  });

  const mailOptions = {
    from: "hohoangphucjob@gmail.com",
    to: email,
    subject: "Thông Tin Đơn Hàng Của Bạn",
    html: orderMessage,
  };

  try {
    // Gửi email
    await transporter.sendMail(mailOptions);
    return {
      EM: "Gửi email đơn hàng thành công",
      EC: 1,
    };
  } catch (error) {
    console.error("Error sending order email:", error);
    return {
      EM: "Gửi email thất bại",
      EC: -1,
    };
  }
};

// Cập nhật đơn hàng
const updateDON_HANG = async (req, res) => {
  const { id } = req.params;
  const {
    idNguoiDung,
    idThanhToan,
    tongTien,
    trangThaiDonHang,
    ghiChuDonHang,
  } = req.body;
  try {
    const [results] = await connection.execute(
      "SELECT * FROM don_hang WHERE ID_DON_HANG = ?",
      [id]
    );

    if (results.length > 0) {
      const ngayCapNhatDonHang = new Date(); // Lấy ngày hiện tại
      await connection.execute(
        "UPDATE don_hang SET ID_NGUOI_DUNG = ?, ID_THANH_TOAN = ?, TONG_TIEN = ?, TRANG_THAI_DON_HANG = ?, GHI_CHU_DONHANG = ?, NGAY_CAP_NHAT_DONHANG = ? WHERE ID_DON_HANG = ?",
        [
          idNguoiDung,
          idThanhToan,
          tongTien,
          trangThaiDonHang,
          ghiChuDonHang,
          ngayCapNhatDonHang,
          id,
        ]
      );
      return {
        EM: "Cập nhật đơn hàng thành công",
        EC: 1,
        DT: [],
      };
    } else {
      return {
        EM: "Không tìm thấy đơn hàng",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.error("Error updating don hang:", error);
    return {
      EM: "Có lỗi xảy ra khi cập nhật đơn hàng",
      EC: 0,
      DT: [],
    };
  }
};

// Xóa đơn hàng
const deleteDON_HANG = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await connection.execute(
      "SELECT * FROM don_hang WHERE ID_DON_HANG = ?",
      [id]
    );

    if (results.length > 0) {
      await connection.execute("DELETE FROM DON_HANG WHERE ID_DON_HANG = ?", [
        id,
      ]);
      return {
        EM: "Xóa đơn hàng thành công",
        EC: 1,
        DT: [],
      };
    } else {
      return {
        EM: "Không tìm thấy đơn hàng để xóa",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.error("Error deleting don hang:", error);
    return {
      EM: "Có lỗi xảy ra khi xóa đơn hàng",
      EC: 0,
      DT: [],
    };
  }
};

// Cập nhật trạng thái đơn hàng là "Đã hủy" cho USER
const updateOrderStatusCanceled_User = async (req, res) => {
  const { orderId } = req.params; // ID đơn hàng từ tham số URL
  const { userId } = req.user; // ID người dùng từ thông tin xác thực (JWT)

  try {
    // Kiểm tra xem người dùng có quyền cập nhật đơn hàng này không
    const [orderCheck] = await connection.execute(
      `SELECT * FROM DON_HANG WHERE ID_ODER = ? AND ID_NGUOI_DUNG = ?`,
      [orderId, userId] // Xác nhận người dùng có quyền truy cập đơn hàng này
    );

    if (orderCheck.length === 0) {
      return res.status(403).json({
        EM: "Bạn không có quyền cập nhật trạng thái đơn hàng này",
        EC: 0,
        DT: [],
      });
    }

    // Cập nhật trạng thái đơn hàng
    const [result] = await connection.execute(
      `UPDATE DON_HANG 
       SET TRANG_THAI_DON_HANG = 'Đã hủy', 
           NGAY_CAP_NHAT_DONHANG = NOW() 
       WHERE ID_ODER = ? AND ID_NGUOI_DUNG = ?`,
      [orderId, userId] // Đảm bảo chỉ người dùng đó mới có thể cập nhật đơn hàng của mình
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        EM: "Cập nhật trạng thái đơn hàng thành công",
        EC: 1,
        DT: [],
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng này",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
      EC: 0,
      DT: [],
    });
  }
};
// Cập nhật trạng thái đơn hàng là "Đã hủy" ADMIN
const updateOrderStatusCanceled = async (req, res) => {
  const { orderId } = req.params; // ID đơn hàng từ tham số URL
  console.log("orderId", orderId);
  try {
    // Cập nhật trạng thái đơn hàng
    const [result] = await connection.execute(
      `UPDATE DON_HANG 
       SET TRANG_THAI_DON_HANG = 'Đã hủy', 
           NGAY_CAP_NHAT_DONHANG = NOW() 
       WHERE ID_DON_HANG = ?`,
      [orderId] // Tham số orderId để xác định đơn hàng cần cập nhật
    );
    console.log("result", result);
    if (result.affectedRows > 0) {
      return res.status(200).json({
        EM: "Cập nhật trạng thái đơn hàng thành công",
        EC: 1,
        DT: [],
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
      EC: 0,
      DT: [],
    });
  }
};

// Cập nhật trạng thái đơn hàng là "Giao dịch thành công" ADMIN

const updateOrderStatusSuccess = async (req, res) => {
  const { orderId } = req.params; // ID đơn hàng từ tham số URL
  console.log("orderId", orderId);

  let conn; // Khai báo biến kết nối

  try {
    // Lấy kết nối từ pool
    conn = await connection.getConnection();

    // Bắt đầu giao dịch
    await conn.beginTransaction();

    // Cập nhật trạng thái đơn hàng
    const [result] = await conn.execute(
      `UPDATE DON_HANG 
       SET TRANG_THAI_DON_HANG = 'Giao dịch thành công', 
           NGAY_CAP_NHAT_DONHANG = NOW() 
       WHERE ID_DON_HANG = ?`,
      [orderId]
    );

    if (result.affectedRows > 0) {
      // Lấy danh sách chi tiết đơn hàng (sản phẩm)
      const [orderDetails] = await conn.execute(
        `SELECT ID_SAN_PHAM, SO_LUONG_SP FROM CHI_TIET_HOA_DON WHERE ID_DON_HANG = ?`,
        [orderId]
      );

      // Trừ số lượng sản phẩm trong bảng SAN_PHAM
      for (let i = 0; i < orderDetails.length; i++) {
        const { ID_SAN_PHAM, SO_LUONG_SP } = orderDetails[i];
        await conn.execute(
          `UPDATE SAN_PHAM 
           SET SO_LUONG_SANPHAM = SO_LUONG_SANPHAM - ? 
           WHERE ID_SAN_PHAM = ?`,
          [SO_LUONG_SP, ID_SAN_PHAM]
        );
      }

      // Nếu tất cả các thao tác thành công, commit giao dịch
      await conn.commit();

      return res.status(200).json({
        EM: "Cập nhật trạng thái đơn hàng thành công và trừ số lượng sản phẩm",
        EC: 1,
        DT: [],
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    // Nếu có lỗi, rollback giao dịch
    if (conn) {
      await conn.rollback();
    }
    console.error("Error updating order status:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
      EC: 0,
      DT: [],
    });
  } finally {
    // Giải phóng kết nối
    if (conn) {
      conn.release();
    }
  }
};
module.exports = {
  getDON_HANG,
  createDON_HANG,
  updateDON_HANG,
  deleteDON_HANG,
  updateTrangThaiDonHang,
  getDON_HANG_ByIDUser,
  updateOrderStatusCanceled_User,
  updateOrderStatusCanceled,
  updateOrderStatusSuccess,
};
