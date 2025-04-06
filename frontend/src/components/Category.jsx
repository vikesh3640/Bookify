import React, { useState, useEffect } from "react";
import "../../src/css/Category.css";

const categories = [
  { name: "Fiction", image: "/fiction.png" },
  { name: "Comics", image: "/s5.jpg" },
  { name: "Children's Books", image: "/s2.jpg" },
  { name: "Mystery & Thriller", image: "/s4.jpg" },
  { name: "Academic", image: "/s6.jpg" },
];

const promotions = [
  { title: "New Arrivals", discount: "Latest Releases", image: "/img1.jpg" },
  { title: "Used", discount: "Get Up to 60% Off", image: "/img6.jpg" },
  { title: "Bestsellers", discount: "Get Up to 40% Off", image: "/img3.jpg" },
  { title: "Chaotic", discount: "Limited Edition", image: "/img5.jpg" },
  { title: "Rare Collections", discount: "Limited number", image: "/img2.jpg" },
  { title: "Most Sold", discount: "Top class", image: "/img4.jpg" },
];

const infinitePromotions = [...promotions, ...promotions.slice(0, 2)];

const BookCategories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === promotions.length) {
      setTimeout(() => {
        setTransitionEnabled(true);
        setCurrentIndex(0);
        requestAnimationFrame(() => setTransitionEnabled(true));
      }, 1000);
    }
  }, [currentIndex]);

  return (
    <div className="book-categories-container">
      {/* Promotions Section */}
      <div className="promotions-wrapper">
        <div
          className="promotions-container"
          style={{
            transform: `translateX(-${currentIndex * 50}%)`,
            transition: transitionEnabled ? "transform 1s cubic-bezier(0.4, 0.0, 0.2, 1)" : "none",
          }}
        >
          {infinitePromotions.map((promo, index) => (
            <div key={index} className="promo-card" style={{ backgroundImage: `url(${promo.image})` }}>
              <div className="promo-content">
                <h3>{promo.title}</h3>
                <p>{promo.discount}</p>
                <button className="shop-now-btn">Shop Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <h2 className="section-title">Featured Categories</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <img src={category.image} alt={category.name} />
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCategories;
