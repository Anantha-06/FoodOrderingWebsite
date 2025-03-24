import React from "react";
import Slider from "react-slick";
import Image from "react-bootstrap/Image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../App.css";
import useFetch from "../../Hooks/useFetch.jsx";

const SliderArrow = ({ className, style, onClick, position }) => {
  const arrowStyle =
    position === "next"
      ? { ...style, right: "10px" }
      : { ...style, left: "10px", zIndex: "1" };

  return <div className={className} style={arrowStyle} onClick={onClick} />;
};

const BestSellerSlider = () => {
  const [data, isLoading, error] = useFetch("/menu/all");
  const productList = data?.menuItems || [];
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 },
      },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 400,
    cssEase: "linear",
    nextArrow: <SliderArrow position="next" />,
    prevArrow: <SliderArrow position="prev" />,
  };
  if (isLoading) return <p>Loading products...</p>;
  if (error) {
    console.error("Fetch Error:", error);
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <div className="bestseller-container text-center my-3">
        <div className="bestseller-header">
          <h2 className="bestseller-title fs-1 fw-bold my-3">Best Seller</h2>
        </div>
        <div className="bestseller-slider">
          {productList.length > 0 ? (
            <Slider {...settings}>
              {productList.map((item, index) => (
                <div key={index} className="bestseller-item">
                  <div className="bestseller-image-wrapper">
                    <Image
                      roundedCircle
                      width={250}
                      height={250}
                      src={item.image}
                      alt={item.name}
                      className="bestseller-image"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="bestseller-empty">No bestsellers available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellerSlider;
