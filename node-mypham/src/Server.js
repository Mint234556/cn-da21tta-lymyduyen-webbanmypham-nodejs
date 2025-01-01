const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;
require("./config/database.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hostname = process.env.HOST_NAME || "localhost";

//setting
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins dynamically
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "src/public/images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//api user
const userRoute = require("./routers/nguoiDungRouter/userRouters.js");

//api products
const sanPhamRoute = require("./routers/sanPhamRouters/SanPhamRouter.js");
const danhMucSanPham = require("./routers/sanPhamRouters/categoriesRoute.js");
const thongKeRoute = require("./routers/sanPhamRouters/thongKeRoute.js");
//api thanh toán

const donHangRoute = require("./routers/thanhToanRouter/donHangRouter.js");
const chiTietHoaDonRoute = require("./routers/thanhToanRouter/chiTietHoaDonRouter.js");
const khuyenMaiRoute = require("./routers/thanhToanRouter/khuyenMaiRouter.js");
//api tương tác người dùng
const gioHangRoute = require("./routers/tuongTacUserRouter/gioHangRouter.js");

app.use("/", userRoute);
//
app.use("/san-pham", sanPhamRoute);
app.use("/danh-muc", danhMucSanPham);

//
app.use("/gio-hang/", gioHangRoute);
app.use("/chi-tiet-hoa-don/", chiTietHoaDonRoute);
//
app.use("/don-hang/", donHangRoute);
app.use("/khuyen-mai/", khuyenMaiRoute);

// Sử dụng router cho thống kê
app.use("/thong-ke", thongKeRoute);

const configViewEngine = require("./config/viewEngine");
configViewEngine(app);

app.listen(port, hostname, () => {
  console.log(`${hostname}Example app listening on port ${port}`);
});
