import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import sonMoi from "../../public/slide-view/img1.png";
import kemDuong from "../../public/slide-view/img2.png";
import mascara from "../../public/slide-view/img3.png";
import phanPhu from "../../public/slide-view/img4.png";
import suaRuaMat from "../../public/slide-view/img1.png";
import serum from "../../public/slide-view/img3.png";

const products = [
  { name: "Son Môi", image: sonMoi },
  { name: "Kem Dưỡng Da", image: kemDuong },
  { name: "Mascara", image: mascara },
  { name: "Phấn Phủ", image: phanPhu },
  { name: "Sữa Rửa Mặt", image: suaRuaMat },
  { name: "Serum", image: serum },
  { name: "Son Môi", image: sonMoi },
  { name: "Kem Dưỡng Da", image: kemDuong },
  { name: "Mascara", image: mascara },
  { name: "Phấn Phủ", image: phanPhu },
  { name: "Sữa Rửa Mặt", image: suaRuaMat },
  { name: "Serum", image: serum },
  { name: "Son Môi", image: sonMoi },
  { name: "Kem Dưỡng Da", image: kemDuong },
  { name: "Mascara", image: mascara },
  { name: "Phấn Phủ", image: phanPhu },
  { name: "Sữa Rửa Mặt", image: suaRuaMat },
  { name: "Serum", image: serum },
];

const TrendingProducts = () => {
  const [visibleIndex, setVisibleIndex] = React.useState(0);

  const handlePrev = () => {
    setVisibleIndex((prev) =>
      prev > 0 ? prev - 1 : Math.floor(products.length / 5)
    );
  };

  const handleNext = () => {
    setVisibleIndex((prev) =>
      prev < Math.floor(products.length / 5) ? prev + 1 : 0
    );
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <IconButton onClick={handlePrev}>
        <ArrowBackIosIcon />
      </IconButton>
      <Box sx={{ display: "flex", overflow: "hidden", width: "80%" }}>
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${visibleIndex * 100}%)`,
          }}
        >
          {products.map((product, index) => (
            <Box
              key={index}
              sx={{
                width: "20%", // Adjust width to show 3 products per slide
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "60%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
              <Typography>{product.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <IconButton onClick={handleNext}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default TrendingProducts;
