/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     12/4/2024 10:05:37 AM                        */
/*==============================================================*/


/*==============================================================*/
/* Table: CHITIETDONHANG                                        */
/*==============================================================*/
create table CHITIETDONHANG
(
   IDCHITIETDONHANG     int not null  comment '',
   MASANPHAM            varchar(10) not null  comment '',
   MADONHANG            varchar(255) not null  comment '',
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
   MALOAISANPHAM        varchar(255) not null  comment '',
   TENLOAISANPHAM       varchar(255)  comment '',
   MOTA                 varchar(255)  comment '',
   primary key (MALOAISANPHAM)
);

/*==============================================================*/
/* Table: DONHANG                                               */
/*==============================================================*/
create table DONHANG
(
   MADONHANG            varchar(255) not null  comment '',
   MAKHUYENMAI          varchar(255)  comment '',
   MANGUOIDUNG          varchar(255) not null  comment '',
   TRANGTHAI            varchar(100)  comment '',
   NGAYTHANHTOAN        datetime  comment '',
   DIACHIDONHANG        varchar(255)  comment '',
   HINHTHUCTHANHTOAN    varchar(255)  comment '',
   TONGTIEN             float  comment '',
   primary key (MADONHANG)
);

/*==============================================================*/
/* Table: KHUYENMAI                                             */
/*==============================================================*/
create table KHUYENMAI
(
   MAKHUYENMAI          varchar(255) not null  comment '',
   CODE                 varchar(255)  comment '',
   MOTA                 varchar(255)  comment '',
   HANSUDUNG            datetime  comment '',
   primary key (MAKHUYENMAI)
);

/*==============================================================*/
/* Table: NGUOIDUNG                                             */
/*==============================================================*/
create table NGUOIDUNG
(
   MANGUOIDUNG          varchar(255) not null  comment '',
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
   MASANPHAM            varchar(10) not null  comment '',
   MALOAISANPHAM        varchar(255) not null  comment '',
   TENSANPHAM           varchar(50)  comment '',
   MOTA                 varchar(255)  comment '',
   GIA                  float  comment '',
   SOLUONG              int  comment '',
   HINHANHSANPHAM       varchar(255)  comment '',
   CREATED_AT_SP        datetime  comment '',
   UPDATED_AT_SP        datetime  comment '',
   primary key (MASANPHAM)
);

/*==============================================================*/
/* Table: THEM                                                  */
/*==============================================================*/
create table THEM
(
   MADONHANG            varchar(255) not null  comment '',
   MASANPHAM            varchar(10) not null  comment '',
   SOLUONGDAT           int  comment '',
   primary key (MADONHANG, MASANPHAM)
);

alter table CHITIETDONHANG add constraint FK_CHITIETD_COCHITIET_SANPHAM foreign key (MASANPHAM)
      references SANPHAM (MASANPHAM) on delete restrict on update restrict;

alter table CHITIETDONHANG add constraint FK_CHITIETD_COCHITIET_DONHANG foreign key (MADONHANG)
      references DONHANG (MADONHANG) on delete restrict on update restrict;

alter table DONHANG add constraint FK_DONHANG_AP_DUNG_KHUYENMA foreign key (MAKHUYENMAI)
      references KHUYENMAI (MAKHUYENMAI) on delete restrict on update restrict;

alter table DONHANG add constraint FK_DONHANG_TAO_NGUOIDUN foreign key (MANGUOIDUNG)
      references NGUOIDUNG (MANGUOIDUNG) on delete restrict on update restrict;

alter table SANPHAM add constraint FK_SANPHAM_CHUA_DANHMUCS foreign key (MALOAISANPHAM)
      references DANHMUCSANPHAM (MALOAISANPHAM) on delete restrict on update restrict;

alter table THEM add constraint FK_THEM_THEM_DONHANG foreign key (MADONHANG)
      references DONHANG (MADONHANG) on delete restrict on update restrict;

alter table THEM add constraint FK_THEM_THEM2_SANPHAM foreign key (MASANPHAM)
      references SANPHAM (MASANPHAM) on delete restrict on update restrict;

