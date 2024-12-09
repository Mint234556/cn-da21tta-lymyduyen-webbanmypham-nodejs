/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     12/7/2024 9:11:09 PM                         */
/*==============================================================*/


/*==============================================================*/
/* Table: AP_DUNG                                               */
/*==============================================================*/
create table AP_DUNG
(
   MADONHANG            INT not null  comment '',
   MAKHUYENMAI          INT not null  comment '',
   NGAYAPDUNG           datetime  comment '',
   primary key (MADONHANG, MAKHUYENMAI)
);

/*==============================================================*/
/* Table: CHITIETDONHANG                                        */
/*==============================================================*/
create table CHITIETDONHANG
(
   IDCHITIETDONHANG     INT AUTO_INCREMENT NOT NULL COMMENT '',
   MASANPHAM            INT not null  comment '',
   MADONHANG            INT not null  comment '',
   GIASP                float  comment '',
   SOLUONGSP            int  comment '',
   DANHGIA              int  comment '',
   BINHLUAN             text  comment '',
   primary key (IDCHITIETDONHANG)
);

/*==============================================================*/
/* Table: DANHMUCSANPHAM                                        */
/*==============================================================*/
create table DANHMUCSANPHAM
(
   MALOAISANPHAM        INT AUTO_INCREMENT NOT NULL COMMENT '',
   TENLOAISANPHAM       varchar(255)  comment '',
   MOTA                 varchar(255)  comment '',
   primary key (MALOAISANPHAM)
);

/*==============================================================*/
/* Table: DONHANG                                               */
/*==============================================================*/
create table DONHANG
(
   MADONHANG            INT AUTO_INCREMENT NOT NULL COMMENT '',
   MANGUOIDUNG          INT not null  comment '',
   TRANGTHAI            varchar(100)  comment '',
   NGAYTHANHTOAN        datetime  comment '',
   DIACHIDONHANG        varchar(255)  comment '',
   HINHTHUCTHANHTOAN    varchar(255)  comment '',
   TONGTIEN             float  comment '',
   primary key (MADONHANG)
);

/*==============================================================*/
/* Table: GIOHANG                                               */
/*==============================================================*/
create table GIOHANG
(
   MAGIOHANG            INT AUTO_INCREMENT NOT NULL COMMENT '',
   MASANPHAM            INT not null  comment '',
   MANGUOIDUNG          INT not null  comment '',
   NGAYCAPNHAT          datetime  comment '',
   primary key (MAGIOHANG)
);

/*==============================================================*/
/* Table: KHUYENMAI                                             */
/*==============================================================*/
create table KHUYENMAI
(
   MAKHUYENMAI          INT AUTO_INCREMENT NOT NULL COMMENT '',
   CODE                 varchar(255)  comment '',
   MOTA                 varchar(255)  comment '',
   HANSUDUNG            datetime  comment '',
   SOTIENGIAM           float  comment '',
   primary key (MAKHUYENMAI)
);

/*==============================================================*/
/* Table: NGUOIDUNG                                             */
/*==============================================================*/
create table NGUOIDUNG
(
   MANGUOIDUNG          INT AUTO_INCREMENT NOT NULL COMMENT '',
   TENNGUOIDUNG         varchar(50)  comment '',
   EMAIL                varchar(80)  comment '',
   DIACHI               varchar(100)  comment '',
   SODIENTHOAI          varchar(10)  comment '',
   TRANGTHAINGUOIDUNG   varchar(255)  comment '',
   MATKHAU              varchar(255)  comment '',
   VAITRO               varchar(255)  comment '',
   primary key (MANGUOIDUNG)
);

/*==============================================================*/
/* Table: SANPHAM                                               */
/*==============================================================*/
create table SANPHAM
(
   MASANPHAM            INT AUTO_INCREMENT NOT NULL COMMENT '',
   MALOAISANPHAM        INT not null  comment '',
   TENSANPHAM           varchar(50)  comment '',
   MOTA                 varchar(255)  comment '',
   GIA                  float  comment '',
   SOLUONG              int  comment '',
   HINHANHSANPHAM       varchar(255)  comment '',
   CREATED_AT_SP        datetime  comment '',
   UPDATED_AT_SP        datetime  comment '',
   primary key (MASANPHAM)
);

alter table AP_DUNG add constraint FK_AP_DUNG_AP_DUNG_DONHANG foreign key (MADONHANG)
      references DONHANG (MADONHANG) on delete restrict on update restrict;

alter table AP_DUNG add constraint FK_AP_DUNG_AP_DUNG2_KHUYENMA foreign key (MAKHUYENMAI)
      references KHUYENMAI (MAKHUYENMAI) on delete restrict on update restrict;

alter table CHITIETDONHANG add constraint FK_CHITIETD_COCHITIET_SANPHAM foreign key (MASANPHAM)
      references SANPHAM (MASANPHAM) on delete restrict on update restrict;

alter table CHITIETDONHANG add constraint FK_CHITIETD_COCHITIET_DONHANG foreign key (MADONHANG)
      references DONHANG (MADONHANG) on delete restrict on update restrict;

alter table DONHANG add constraint FK_DONHANG_TAO_NGUOIDUN foreign key (MANGUOIDUNG)
      references NGUOIDUNG (MANGUOIDUNG) on delete restrict on update restrict;

alter table GIOHANG add constraint FK_GIOHANG_GIOHANGNG_NGUOIDUN foreign key (MANGUOIDUNG)
      references NGUOIDUNG (MANGUOIDUNG) on delete restrict on update restrict;

alter table GIOHANG add constraint FK_GIOHANG_GIOHANGSA_SANPHAM foreign key (MASANPHAM)
      references SANPHAM (MASANPHAM) on delete restrict on update restrict;

alter table SANPHAM add constraint FK_SANPHAM_CHUA_DANHMUCS foreign key (MALOAISANPHAM)
      references DANHMUCSANPHAM (MALOAISANPHAM) on delete restrict on update restrict;

