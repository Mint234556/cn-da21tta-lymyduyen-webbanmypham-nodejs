const db = require("../../config/database");

// Thống kê đơn hàng
const getTotalOrders = async (req, res) => {
  const query = `SELECT COUNT(MADONHANG) AS total_orders FROM DONHANG`;

  try {
    const [results] = await db.query(query); // Using promise with await
    res.status(200).json({
      EM: "Thống kê đơn hàng thành công",
      EC: 1,
      DT: results[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi thống kê đơn hàng",
      EC: -1,
      DT: null,
    });
  }
};

// Refactor other functions similarly:
const getTotalRevenue = async (req, res) => {
  const query = `
    SELECT SUM(TONGTIEN) AS total_revenue
    FROM DONHANG
    WHERE TRANGTHAI = 'Giao dịch thành công'
  `;
  try {
    const [results] = await db.query(query);
    res.status(200).json({
      EM: "Thống kê doanh thu thành công",
      EC: 1,
      DT: results[0],
    });
  } catch (err) {
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi thống kê doanh thu",
      EC: -1,
      DT: null,
    });
  }
};

const getTotalCustomers = async (req, res) => {
  const query = `
    SELECT COUNT(DISTINCT MANGUOIDUNG) AS total_customers
    FROM NGUOIDUNG
    WHERE VAITRO = 'user'
  `;
  try {
    const [results] = await db.query(query);
    res.status(200).json({
      EM: "Thống kê khách hàng thành công",
      EC: 1,
      DT: results[0],
    });
  } catch (err) {
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi thống kê khách hàng",
      EC: -1,
      DT: null,
    });
  }
};

const getTopFiveBestSellers = async (req, res) => {
  const query = `
    SELECT sp.MASANPHAM, sp.TENSANPHAM, SUM(ctdh.SOLUONGSP) AS total_sold
    FROM CHITIETDONHANG ctdh
    JOIN SANPHAM sp ON ctdh.MASANPHAM = sp.MASANPHAM
    GROUP BY sp.MASANPHAM, sp.TENSANPHAM
    ORDER BY total_sold DESC
    LIMIT 5
  `;
  try {
    const [results] = await db.query(query);
    res.status(200).json({
      EM: "Xem 5 sản phẩm bán chạy nhất thành công",
      EC: 1,
      DT: results,
    });
  } catch (err) {
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy 5 sản phẩm bán chạy nhất",
      EC: -1,
      DT: null,
    });
  }
};

const getOnlineUsersCount = async (req, res) => {
  const query = `
    SELECT COUNT(DISTINCT n.MANGUOIDUNG) AS online_users_count
    FROM NGUOIDUNG n
    JOIN DONHANG d ON n.MANGUOIDUNG = d.MANGUOIDUNG
    WHERE d.TRANGTHAI  = 'Online' 
      AND d.NGAYTHANHTOAN IS NOT NULL 
      AND d.TRANGTHAI = 'Giao dịch thành công'
  `;

  try {
    const [results] = await db.query(query);
    res.status(200).json({
      EM: "Thống kê số lượng người dùng online thanh toán thành công",
      EC: 1,
      DT: results[0].online_users_count,
    });
  } catch (err) {
    console.error(
      "Error fetching online users count who have made a payment:",
      err
    );
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi thống kê số lượng người dùng online thanh toán",
      EC: -1,
      DT: null,
    });
  }
};

module.exports = {
  getTotalOrders,
  getTotalRevenue,
  getTotalCustomers,
  getTopFiveBestSellers,
  getOnlineUsersCount,
};
