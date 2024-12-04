const connection = require("../../config/database");

const getChiTietHoaDon = async (req, res) => {
  const { id } = req.params;
  try {
    // Truy vấn bảng DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN, 
             dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
         
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.ID_DON_HANG = ?
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );

    // Truy vấn bảng CHI_TIET_HOA_DON
    const [chiTietHoaDonResults] = await connection.execute(
      `
       SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID, 
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    
    -- Additional fields from PHONG_CACH, MAU_SAC, MUC_DICH_SU_DUNG, and KICH_CO tables
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    pc.CREATED_PHONG_CACH, 
    pc.UPDATE_PHONG_CACH, 
    pc.TRANG_THAI_PHONG_CACH,
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    ms.CREATE_MAU_SAC, 
    ms.UPDATE_MAU_SAC, 
    ms.TRANG_THAI_MAU_SAC,
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    mdsd.CREATE_MUC_DICH_SU_DUNG, 
    mdsd.UPDATE_MUC_DICH_SU_DUNG, 
    mdsd.TRANG_THAI_MUC_DICH_SU_DUNG,
    kc.ID_KICH_CO, 
    kc.KICH_CO, 
    kc.TRANG_THAI_KICH_CO, 
    kc.CREATED_KICH_CO, 
    kc.UPDATE_KICH_CO,
    
    -- Fields from CHI_TIET_HOA_DON
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET
    
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU

-- Joins to retrieve additional details
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
    
LEFT JOIN 
    MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID

LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG

LEFT JOIN 
    CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
LEFT JOIN 
    KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO

-- Adding CHI_TIET_HOA_DON details
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM

WHERE 
    cthd.ID_DON_HANG = ?;



        `,
      [id]
    );

    // Ghép kết quả lại với nhau
    if (donHangResults.length > 0) {
      const result = {
        ...donHangResults[0], // Thông tin đơn hàng
        chiTietHoaDon: chiTietHoaDonResults, // Thông tin chi tiết hóa đơn
      };

      return res.status(200).json({
        EM: "Lấy chi tiết hóa đơn thành công",
        EC: 1,
        DT: result,
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng này",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Giao dịch thành công
const getChiTietHoaDonTheoNguoiDung_Success = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,  dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG, 
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG = 'Giao dịch thành công'
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID, 
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO,
        cthd.DANH_GIA,
        cthd.BINH_LUAN,
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET,
        cthd.ID_DON_HANG
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM
      WHERE 
        cthd.ID_DON_HANG IN (?)`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Đã hủy
const getChiTietHoaDonTheoNguoiDung_Cancel = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG = 'Đã hủy' 
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID, 
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO,
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET,
        cthd.ID_DON_HANG
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM
      WHERE 
        cthd.ID_DON_HANG IN (?)`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Đang chờ thanh toán
const getChiTietHoaDonTheoNguoiDung_WaitingThanhToan = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG = 'Đang chờ thanh toán'  
          ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID, 
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO,
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET,
        cthd.ID_DON_HANG
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM
      WHERE 
        cthd.ID_DON_HANG IN (?)`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

// Thanh toán thành công và đang chờ xử lý và đang chờ thành toán
const getPaidOrdersAwaitingProcessing = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
  dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG IN ('Đang chờ thanh toán', 'Đã thanh toán thành công và đang chờ giao hàng')
   ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,

      [id]
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID,  
    
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO,
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET,
        cthd.ID_DON_HANG
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM
      WHERE 
        cthd.ID_DON_HANG IN (?)`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Đánh giá sản phẩm
const addReviewAndComment = async (req, res) => {
  const { ID_HOA_DON, products } = req.body;
  console.log("re", req.body);
  try {
    // Kiểm tra dữ liệu đầu vào
    if (
      !ID_HOA_DON ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        EM: "Thiếu thông tin đánh giá hoặc bình luận",
        EC: 0,
      });
    }

    // Lặp qua từng sản phẩm và cập nhật đánh giá, bình luận
    for (let product of products) {
      const { id, rating, comments } = product;

      // Cập nhật thông tin đánh giá và bình luận vào bảng CHI_TIET_HOA_DON
      const [updateResult] = await connection.execute(
        `UPDATE CHI_TIET_HOA_DON 
         SET DANH_GIA = ?, BINH_LUAN = ? 
         WHERE ID_CHI_TIET_HOA_DON = ?`,
        [rating, comments, id]
      );

      // Kiểm tra nếu không có bản ghi nào được cập nhật
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({
          EM: `Không tìm thấy chi tiết hóa đơn với ID ${id}`,
          EC: 0,
        });
      }
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      EM: "Cập nhật đánh giá và bình luận thành công",
      EC: 1,
    });
  } catch (error) {
    console.error("Error updating review and comment:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật đánh giá và bình luận",
      EC: 0,
    });
  }
};

// ADMIN ----------------------------------------------------------------------
// lấy tất cả các đơn hàng ra -> ADMIN
const getAllChiTietHoaDon_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN, 
          dh.DIA_CHI_DON_HANG,
          dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC
      `
    );

    // Truy vấn bảng CHI_TIET_HOA_DON
    const [chiTietHoaDonResults] = await connection.execute(
      `
      SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID, 
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO, 
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM;
      `
    );

    // Ghép kết quả lại với nhau
    if (donHangResults.length > 0) {
      const result = donHangResults.map((donHang) => ({
        ...donHang, // Thông tin đơn hàng
        chiTietHoaDon: chiTietHoaDonResults.filter(
          (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
        ), // Lọc chi tiết hóa đơn cho mỗi đơn hàng
      }));

      return res.status(200).json({
        EM: "Lấy chi tiết hóa đơn thành công",
        EC: 1,
        DT: result,
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng nào ",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

// Thanh toán thành công và đang chờ xử lý => ALL  ADMIN
const getALLPaidOrdersAwaitingProcessing_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
  dh.TRANG_THAI_DON_HANG IN ('Đang chờ thanh toán', 'Đã thanh toán thành công và đang chờ giao hàng')
    ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID,  
    
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO,
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET,
        cthd.ID_DON_HANG
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM
      WHERE 
        cthd.ID_DON_HANG IN (?)`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Đã hủy  => ALL  ADMIN
const getALLChiTietHoaDonTheoNguoiDung_Cancel_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.TRANG_THAI_DON_HANG = 'Đã hủy'
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID, 
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO,
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET,
        cthd.ID_DON_HANG
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM
      WHERE 
        cthd.ID_DON_HANG IN (?)`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

// Giao dịch thành công => ALL ADMIN
const getAllChiTietHoaDonTheoNguoiDung_Success_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,  dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG, 
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.TRANG_THAI_DON_HANG = 'Giao dịch thành công' 
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID, 
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO,
        cthd.DANH_GIA,
        cthd.BINH_LUAN,
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET,
        cthd.ID_DON_HANG
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM
      WHERE 
        cthd.ID_DON_HANG IN (?)`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

module.exports = {
  getChiTietHoaDon,
  getChiTietHoaDonTheoNguoiDung_Success,
  getChiTietHoaDonTheoNguoiDung_Cancel,
  getPaidOrdersAwaitingProcessing,
  getChiTietHoaDonTheoNguoiDung_WaitingThanhToan,
  addReviewAndComment,
  //
  getAllChiTietHoaDon_Admin,
  getALLPaidOrdersAwaitingProcessing_Admin,
  getALLChiTietHoaDonTheoNguoiDung_Cancel_Admin,
  getAllChiTietHoaDonTheoNguoiDung_Success_Admin,
};
