import React from "react";
import { Grid, Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import styles
import carousel1 from "../../public/carousel-1.jpg";
import carousel2 from "../../public/carousel-2.jpg";
import carousel3 from "../../public/carousel-3.jpg";

import img1 from "../../public/img-1.png";
import img2 from "../../public/img-2.png";
import img3 from "../../public/img-3.jpg";
import TrendingProducts from "../component-view/slideViewComponent";
import FeaturedBrands from "../component-view/slideFeatureBrand";
import ProductGrid from "../component-view/listProduct";

const Home = () => {
  const products = [
    {
      id: 1,
      name: "Sản phẩm 1",
      imageUrl: carousel1,
    },
    {
      id: 2,
      name: "Sản phẩm 2",
      imageUrl: carousel2,
    },
    {
      id: 3,
      name: "Sản phẩm 3",
      imageUrl: carousel3,
    },
  ];
  const apiBestSellers = `${process.env.REACT_APP_URL_SERVER}/san-pham/best-sellers`;
  const apiBestRating = `${process.env.REACT_APP_URL_SERVER}/san-pham/top-rated`;

  return (
    <>
      {" "}
      <div>
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          interval={3000}
          transitionTime={500}
        >
          {products.map((product) => (
            <div key={product.id}>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "100%", height: "80vh", objectFit: "cover" }}
              />
              {/* <p className="legend">{product.name}</p> */}
            </div>
          ))}
        </Carousel>
        <Grid
          sx={{ mt: 4, mb: 4 }}
          container
          spacing={2}
          justifyContent="center"
          mt={2}
        >
          <Grid item xs={12} sm={4}>
            <img
              src={img1}
              alt="Image 1"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <img
              src={img2}
              alt="Image 2"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <img
              src={img3}
              alt="Image 3"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, mb: 4 }}>
          {" "}
          <TrendingProducts />
        </Box>

        <FeaturedBrands />
        <ProductGrid apiURL={apiBestSellers} title={`Sản phẩm bán chạy nhất`} />
        <ProductGrid
          apiURL={apiBestRating}
          title={`Sản phẩm được đánh giá cáo nhất`}
        />
      </div>
    </>
  );
};

export default Home;
