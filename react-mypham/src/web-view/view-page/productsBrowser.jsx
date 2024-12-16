import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CircularProgress,
  Box,
  Autocomplete,
  TextField,
  Button,
  FormControl,
} from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom"; // Thêm các hooks cần thiết

const ProductBrowser = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { categoryId } = useParams(); // Nhận categoryId từ URL
  const navigate = useNavigate();
  const location = useLocation();
  // Hàm lấy dữ liệu sản phẩm và danh mục từ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3002/san-pham/use");
      const response_DanhMuc = await axios.get(
        "http://localhost:3002/danh-muc/use"
      );

      if (response.data.EC === 1) {
        setProducts(response.data.DT);
      } else {
        setProducts([]);
      }

      if (response_DanhMuc.data.EC === 1) {
        setCategories(response_DanhMuc.data.DT);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    if (location) {
      setCategoryFilter(location.state);
    }
  }, [location]);

  // Lọc sản phẩm theo category và search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !categoryFilter || product.MALOAISANPHAM === categoryFilter.MALOAISANPHAM;
    const matchesSearch =
      product.TENSANPHAM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.MOTA.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
  const handleMoveSelectProducts = (id) => {
    navigate(`/select-product/${id}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ marginBottom: 3, display: "flex" }}>
        <FormControl fullWidth margin="dense" sx={{ width: "300px" }}>
          <Autocomplete
            value={categoryFilter}
            onChange={(event, newValue) => setCategoryFilter(newValue)}
            options={categories}
            getOptionLabel={(option) => option.TENLOAISANPHAM}
            renderInput={(params) => <TextField {...params} label="Danh mục" />}
            sx={{ marginBottom: 3 }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense" sx={{ width: "300px", ml: 2 }}>
          <TextField
            fullWidth
            label="Tìm kiếm sản phẩm"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />{" "}
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.MASANPHAM}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:3002/images/${product.HINHANHSANPHAM}`}
                  alt={product.TENSANPHAM}
                />
                <CardContent>
                  <Typography variant="h6">{product.TENSANPHAM}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.MOTA}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "green", marginTop: 1 }}
                  >
                    {new Intl.NumberFormat().format(product.GIA)} VND
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.SOLUONG} sản phẩm còn lại
                  </Typography>
                </CardContent>{" "}
                <Button
                  onClick={() => handleMoveSelectProducts(product.MASANPHAM)}
                >
                  Xem chi tiết
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductBrowser;
