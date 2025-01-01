-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: mypham
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AP_DUNG`
--

DROP TABLE IF EXISTS `AP_DUNG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AP_DUNG` (
  `MADONHANG` int NOT NULL,
  `MAKHUYENMAI` int NOT NULL,
  `NGAYAPDUNG` datetime DEFAULT NULL,
  PRIMARY KEY (`MADONHANG`,`MAKHUYENMAI`),
  KEY `FK_AP_DUNG_AP_DUNG2_KHUYENMA` (`MAKHUYENMAI`),
  CONSTRAINT `FK_AP_DUNG_AP_DUNG2_KHUYENMA` FOREIGN KEY (`MAKHUYENMAI`) REFERENCES `KHUYENMAI` (`MAKHUYENMAI`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_AP_DUNG_AP_DUNG_DONHANG` FOREIGN KEY (`MADONHANG`) REFERENCES `DONHANG` (`MADONHANG`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AP_DUNG`
--

LOCK TABLES `AP_DUNG` WRITE;
/*!40000 ALTER TABLE `AP_DUNG` DISABLE KEYS */;
INSERT INTO `AP_DUNG` VALUES (20,4,'2024-12-31 00:16:20'),(21,3,'2024-12-31 00:21:39'),(22,2,'2024-12-31 00:23:40');
/*!40000 ALTER TABLE `AP_DUNG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CHITIETDONHANG`
--

DROP TABLE IF EXISTS `CHITIETDONHANG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CHITIETDONHANG` (
  `IDCHITIETDONHANG` int NOT NULL AUTO_INCREMENT,
  `MASANPHAM` int NOT NULL,
  `MADONHANG` int NOT NULL,
  `GIASP` decimal(15,2) DEFAULT NULL,
  `SOLUONGSP` int DEFAULT NULL,
  `DANHGIA` int DEFAULT NULL,
  `BINHLUAN` text,
  PRIMARY KEY (`IDCHITIETDONHANG`),
  KEY `FK_CHITIETD_COCHITIET_SANPHAM` (`MASANPHAM`),
  KEY `FK_CHITIETD_COCHITIET_DONHANG` (`MADONHANG`),
  CONSTRAINT `FK_CHITIETD_COCHITIET_DONHANG` FOREIGN KEY (`MADONHANG`) REFERENCES `DONHANG` (`MADONHANG`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_CHITIETD_COCHITIET_SANPHAM` FOREIGN KEY (`MASANPHAM`) REFERENCES `SANPHAM` (`MASANPHAM`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CHITIETDONHANG`
--

LOCK TABLES `CHITIETDONHANG` WRITE;
/*!40000 ALTER TABLE `CHITIETDONHANG` DISABLE KEYS */;
INSERT INTO `CHITIETDONHANG` VALUES (17,4,11,230000.00,1,NULL,NULL),(18,49,11,250000.00,1,NULL,NULL),(19,3,11,120000.00,1,NULL,NULL),(20,54,11,200000.00,1,NULL,NULL),(21,4,12,230000.00,1,NULL,NULL),(22,3,12,120000.00,1,NULL,NULL),(23,54,12,200000.00,1,NULL,NULL),(24,49,12,250000.00,1,NULL,NULL),(25,3,13,120000.00,1,NULL,NULL),(26,4,13,230000.00,1,NULL,NULL),(27,54,13,200000.00,1,NULL,NULL),(28,49,13,250000.00,1,NULL,NULL),(29,3,14,120000.00,1,NULL,NULL),(30,54,14,200000.00,1,NULL,NULL),(31,4,14,230000.00,1,NULL,NULL),(32,49,14,250000.00,1,NULL,NULL),(33,3,15,120000.00,1,NULL,NULL),(34,4,15,230000.00,1,NULL,NULL),(35,54,15,200000.00,1,NULL,NULL),(36,49,15,250000.00,1,NULL,NULL),(37,3,16,120000.00,1,NULL,NULL),(38,4,16,230000.00,1,NULL,NULL),(39,49,16,250000.00,1,NULL,NULL),(40,54,16,200000.00,1,NULL,NULL),(41,3,17,120000.00,1,NULL,NULL),(42,4,17,230000.00,1,NULL,NULL),(43,49,17,250000.00,1,NULL,NULL),(44,54,17,200000.00,1,NULL,NULL),(45,3,18,120000.00,1,NULL,NULL),(46,6,19,320000.00,1,NULL,NULL),(47,5,20,300000.00,1,NULL,NULL),(48,59,21,220000.00,1,NULL,NULL),(49,6,22,320000.00,1,NULL,NULL),(50,7,23,180000.00,1,NULL,NULL);
/*!40000 ALTER TABLE `CHITIETDONHANG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DANHMUCSANPHAM`
--

DROP TABLE IF EXISTS `DANHMUCSANPHAM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DANHMUCSANPHAM` (
  `MALOAISANPHAM` int NOT NULL AUTO_INCREMENT,
  `TENLOAISANPHAM` varchar(255) DEFAULT NULL,
  `MOTA` varchar(255) DEFAULT NULL,
  `TRANG_THAI_DANH_MUC` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MALOAISANPHAM`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DANHMUCSANPHAM`
--

LOCK TABLES `DANHMUCSANPHAM` WRITE;
/*!40000 ALTER TABLE `DANHMUCSANPHAM` DISABLE KEYS */;
INSERT INTO `DANHMUCSANPHAM` VALUES (1,'Kem dưỡng da','Sản phẩm kem dưỡng da giúp làm mềm mịn và tái tạo da, phù hợp cho mọi loại da.','Đang hoạt động'),(2,'Sữa rửa mặt','Sữa rửa mặt nhẹ nhàng làm sạch sâu, giúp loại bỏ bụi bẩn và dầu thừa trên da.','Đang hoạt động'),(3,'Mặt nạ dưỡng da','Mặt nạ giúp cấp ẩm, làm sáng da và ngừa lão hóa, phù hợp cho da khô và da nhạy cảm.','Đang hoạt động'),(4,'Son môi','Son môi với màu sắc tự nhiên, giúp môi mềm mịn và lâu trôi, an toàn cho sức khỏe.','Đang hoạt động'),(5,'Tẩy trang','Tẩy trang nhẹ nhàng loại bỏ lớp trang điểm và bụi bẩn mà không làm khô da.','Đang hoạt động'),(9,'adad','adad','Ngưng hoạt động');
/*!40000 ALTER TABLE `DANHMUCSANPHAM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DONHANG`
--

DROP TABLE IF EXISTS `DONHANG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DONHANG` (
  `MADONHANG` int NOT NULL AUTO_INCREMENT,
  `MANGUOIDUNG` int NOT NULL,
  `TRANGTHAI` varchar(100) DEFAULT NULL,
  `NGAYTHANHTOAN` datetime DEFAULT NULL,
  `DIACHIDONHANG` varchar(255) DEFAULT NULL,
  `HINHTHUCTHANHTOAN` varchar(255) DEFAULT NULL,
  `TONGTIEN` float DEFAULT NULL,
  PRIMARY KEY (`MADONHANG`),
  KEY `FK_DONHANG_TAO_NGUOIDUN` (`MANGUOIDUNG`),
  CONSTRAINT `FK_DONHANG_TAO_NGUOIDUN` FOREIGN KEY (`MANGUOIDUNG`) REFERENCES `NGUOIDUNG` (`MANGUOIDUNG`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DONHANG`
--

LOCK TABLES `DONHANG` WRITE;
/*!40000 ALTER TABLE `DONHANG` DISABLE KEYS */;
INSERT INTO `DONHANG` VALUES (9,8,'Đã hủy','2024-12-30 17:13:38','asdasd','Thanh toán tại nhà',5090000),(10,8,'Đã hủy','2024-12-30 17:13:35','asdasd','Thanh toán tại nhà',5090000),(11,8,'Đã hủy','2024-12-30 17:12:41','asdasd','Thanh toán tại nhà',5090000),(12,8,'Giao dịch thành công','2024-12-30 16:37:06','asdasd','Thanh toán tại nhà',5090000),(13,8,'Giao dịch thành công','2024-12-30 16:37:01','asdasd','Thanh toán tại nhà',5090000),(14,8,'Đã hủy','2024-12-30 16:56:40','asdasd','Thanh toán tại nhà',5090000),(15,8,'Giao dịch thành công','2024-12-30 17:12:42','asdasd','Thanh toán tại nhà',5090000),(16,8,'Giao dịch thành công','2024-12-30 16:37:03','asdasd','Thanh toán tại nhà',5090000),(17,8,'Đã hủy','2024-12-30 16:36:28','asdasd','Thanh toán tại nhà',5090000),(18,8,'Giao dịch thành công','2024-12-30 16:56:26','ádad','Thanh toán tại nhà',120000),(19,8,'Giao dịch thành công','2024-12-30 17:15:41','adad','Thanh toán tại nhà',320000),(20,8,'Giao dịch thành công','2024-12-30 17:51:13','âfagf','Thanh toán tại nhà',367687),(21,8,'Đã hủy','2024-12-30 17:51:12','ADASD','Thanh toán tại nhà',108889),(22,8,'Đã hủy','2024-12-30 17:24:49','ádadad','Thanh toán tại nhà',-123123000000),(23,8,'Đang chờ thanh toán','2024-12-31 00:51:49','adad','Thanh toán tại nhà',180000);
/*!40000 ALTER TABLE `DONHANG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GIOHANG`
--

DROP TABLE IF EXISTS `GIOHANG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GIOHANG` (
  `MAGIOHANG` int NOT NULL AUTO_INCREMENT,
  `MASANPHAM` int NOT NULL,
  `MANGUOIDUNG` int NOT NULL,
  `NGAYCAPNHAT` datetime DEFAULT NULL,
  PRIMARY KEY (`MAGIOHANG`),
  KEY `FK_GIOHANG_GIOHANGNG_NGUOIDUN` (`MANGUOIDUNG`),
  KEY `FK_GIOHANG_GIOHANGSA_SANPHAM` (`MASANPHAM`),
  CONSTRAINT `FK_GIOHANG_GIOHANGNG_NGUOIDUN` FOREIGN KEY (`MANGUOIDUNG`) REFERENCES `NGUOIDUNG` (`MANGUOIDUNG`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_GIOHANG_GIOHANGSA_SANPHAM` FOREIGN KEY (`MASANPHAM`) REFERENCES `SANPHAM` (`MASANPHAM`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GIOHANG`
--

LOCK TABLES `GIOHANG` WRITE;
/*!40000 ALTER TABLE `GIOHANG` DISABLE KEYS */;
/*!40000 ALTER TABLE `GIOHANG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `KHUYENMAI`
--

DROP TABLE IF EXISTS `KHUYENMAI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KHUYENMAI` (
  `MAKHUYENMAI` int NOT NULL AUTO_INCREMENT,
  `CODE` varchar(255) DEFAULT NULL,
  `MOTA` varchar(255) DEFAULT NULL,
  `HANSUDUNG` datetime DEFAULT NULL,
  `SOTIENGIAM` float DEFAULT NULL,
  PRIMARY KEY (`MAKHUYENMAI`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KHUYENMAI`
--

LOCK TABLES `KHUYENMAI` WRITE;
/*!40000 ALTER TABLE `KHUYENMAI` DISABLE KEYS */;
INSERT INTO `KHUYENMAI` VALUES (2,'SFHF1','Đã được sử dụng','2025-01-28 00:00:00',123123000000),(3,'ádasd','Đã được sử dụng','2025-01-27 00:00:00',111111),(4,'SFIHFAKANSAKFL','Đã được sử dụng','2025-01-21 00:00:00',232313),(5,'ABC123','Chưa được sử dụng','2025-01-08 00:00:00',999999);
/*!40000 ALTER TABLE `KHUYENMAI` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NGUOIDUNG`
--

DROP TABLE IF EXISTS `NGUOIDUNG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NGUOIDUNG` (
  `MANGUOIDUNG` int NOT NULL AUTO_INCREMENT,
  `TENNGUOIDUNG` varchar(50) DEFAULT NULL,
  `EMAIL` varchar(80) DEFAULT NULL,
  `DIACHI` varchar(100) DEFAULT NULL,
  `SODIENTHOAI` varchar(10) DEFAULT NULL,
  `TRANGTHAINGUOIDUNG` varchar(255) DEFAULT NULL,
  `MATKHAU` varchar(255) DEFAULT NULL,
  `VAITRO` varchar(255) DEFAULT NULL,
  `AVATAR` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MANGUOIDUNG`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NGUOIDUNG`
--

LOCK TABLES `NGUOIDUNG` WRITE;
/*!40000 ALTER TABLE `NGUOIDUNG` DISABLE KEYS */;
INSERT INTO `NGUOIDUNG` VALUES (1,'alo','alO@gmail.com','sdấd','0327434221','Đang hoạt động',NULL,'user',NULL),(2,'ádadad111','adadadasd','aasdasdádasdasd','3','Đang hoạt động','$2b$10$Ridgxr0m5VQR8Fzz3QlbXOMV3y/u6VObWh0Y7X/wqwMYvtzn3e30W','user',''),(7,'phuc','phucvntv159@gmail.com',NULL,'0327434821','Đang hoạt động','$2b$10$rPbXUeD.a7YhAV8A9VR1z.xk1.FNWp/WRaq.0J56R/X8vaVBMJ.De','user',NULL),(8,'phuc','hohoangphucjob@gmail.com','Đường 18','0327434821','Đang hoạt động','$2b$10$m9i.ym59rqGOaVhlI2M32.lUprZjinC/rvpCr65ZgBprC6bTuF28a','admin','AVATAR-1735277896383.png');
/*!40000 ALTER TABLE `NGUOIDUNG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SANPHAM`
--

DROP TABLE IF EXISTS `SANPHAM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SANPHAM` (
  `MASANPHAM` int NOT NULL AUTO_INCREMENT,
  `MALOAISANPHAM` int NOT NULL,
  `TENSANPHAM` varchar(50) DEFAULT NULL,
  `MOTA` varchar(255) DEFAULT NULL,
  `GIA` float DEFAULT NULL,
  `SOLUONG` int DEFAULT NULL,
  `HINHANHSANPHAM` varchar(255) DEFAULT NULL,
  `CREATED_AT_SP` datetime DEFAULT NULL,
  `UPDATED_AT_SP` datetime DEFAULT NULL,
  `TRANGTHAISANPHAM` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MASANPHAM`),
  KEY `FK_SANPHAM_CHUA_DANHMUCS` (`MALOAISANPHAM`),
  CONSTRAINT `FK_SANPHAM_CHUA_DANHMUCS` FOREIGN KEY (`MALOAISANPHAM`) REFERENCES `DANHMUCSANPHAM` (`MALOAISANPHAM`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SANPHAM`
--

LOCK TABLES `SANPHAM` WRITE;
/*!40000 ALTER TABLE `SANPHAM` DISABLE KEYS */;
INSERT INTO `SANPHAM` VALUES (3,4,'Mỹ phẩm cấp cao ','Đây là ...',120000,7,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 18:42:28','2024-12-10 02:10:55','Đang hoạt động'),(4,2,'Sửa rửa mặt sunsilk','ádad',230000,227,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 18:52:00','2024-12-10 02:11:35','Đang hoạt động'),(5,1,'Kem dưỡng ẩm ban ngày','Kem dưỡng giúp cấp ẩm và bảo vệ da ban ngày.',300000,99,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:16:27','2024-12-09 19:16:27','Đang hoạt động'),(6,1,'Kem dưỡng ẩm ban đêm','Kem dưỡng phục hồi da khi ngủ.',320000,79,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:16:27','2024-12-09 19:16:27','Đang hoạt động'),(7,2,'Sữa rửa mặt trắng da','Sữa rửa mặt giúp da sạch và sáng mịn.',180000,150,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:16:27','2024-12-09 19:16:27','Đang hoạt động'),(8,2,'Sữa rửa mặt dịu nhẹ','Sản phẩm phù hợp cho da nhạy cảm.',200000,200,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:16:27','2024-12-09 19:16:27','Đang hoạt động'),(49,1,'Son môi đỏ Ruby','Son môi màu đỏ Ruby với độ bám tốt',250000,96,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(50,1,'Son dưỡng môi','Son dưỡng môi không màu, giúp dưỡng ẩm',120000,150,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(51,2,'Kem chống nắng SPF 50+','Kem chống nắng dành cho mọi loại da',350000,200,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(52,2,'Kem dưỡng trắng da','Kem dưỡng trắng da ban đêm',450000,120,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(53,3,'Nước tẩy trang','Nước tẩy trang dịu nhẹ cho da nhạy cảm',180000,250,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(54,3,'Sữa rửa mặt tạo bọt','Sữa rửa mặt làm sạch sâu',200000,176,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(55,4,'Mặt nạ dưỡng da','Mặt nạ giấy chứa dưỡng chất vitamin C',40000,300,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(56,4,'Mặt nạ đất sét','Mặt nạ đất sét giúp làm sạch sâu lỗ chân lông',150000,100,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(57,5,'Phấn nền','Phấn nền mịn màng giúp che khuyết điểm',320000,70,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(58,5,'Phấn phủ kiềm dầu','Phấn phủ giúp kiểm soát dầu nhờn hiệu quả',300000,90,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(59,1,'Nước hoa hồng','Nước hoa hồng cân bằng da',220000,130,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(60,2,'Serum dưỡng ẩm','Serum cấp nước và dưỡng ẩm',550000,60,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(61,5,'Kem lót trang điểm','Kem lót giúp da mịn màng trước khi trang điểm',290000,80,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(62,2,'Mascara làm dài mi','Mascara làm dài và dày mi',210000,95,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(63,2,'Dầu gội phục hồi','Dầu gội giúp phục hồi tóc hư tổn',180000,120,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-10 03:20:29','Ngưng hoạt động'),(64,4,'Dầu xả dưỡng tóc','Dầu xả giúp tóc mềm mượt',160000,130,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(65,5,'Son lì cao cấp','Son lì với độ bền màu cao',300000,110,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(66,4,'Kem che khuyết điểm','Kem che khuyết điểm che phủ hoàn hảo',270000,80,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(67,2,'Sữa dưỡng thể','Sữa dưỡng thể với hương thơm dịu nhẹ',240000,150,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(68,1,'Xịt khoáng','Xịt khoáng làm dịu và cấp nước cho da',200000,140,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 19:23:23','2024-12-09 19:23:23','Đang hoạt động'),(69,3,'Sửa rửa mặt sunsilk','asdadasd',222332000,23,'HINHANHSANPHAM-1733908505801.jpg','2024-12-09 20:20:12','2024-12-11 16:15:05','Ngưng hoạt động');
/*!40000 ALTER TABLE `SANPHAM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mypham'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31  0:54:10
