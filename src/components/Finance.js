import React, { useState, useEffect, useRef } from "react";
import "./Finance.css";

export default function Finance() {
  const reviews = [
    { name: "John D.", text: "Great experience, fast transactions!" },
    { name: "Sarah W.", text: "Very Fast and Reliable." },
    { name: "Mike L.", text: "Very easy to use and secure." },
    { name: "Anna P.", text: "Customer support was fantastic." },
    { name: "David S.", text: "I’m saving money with every trade!" },
    { name: "Emily R.", text: "Clean interface and super intuitive." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Determine cards to show based on screen width
  const getCardsToShow = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const cardsToShow = getCardsToShow();

  // Build visible reviews (wrap around)
  const visibleReviews = [];
  for (let i = 0; i < reviews.length; i++) {
    visibleReviews.push(reviews[i]);
  }

  const translateX = -(currentIndex * (100 / cardsToShow));

  return (
    <section className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="carousel-wrapper">
        <div
          className="carousel-container"
          style={{ transform: `translateX(${translateX}%)` }}
          ref={containerRef}
        >
          {visibleReviews.concat(visibleReviews).map((r, idx) => (
            <div
              className="review"
              key={idx}
              style={{ flex: `0 0 ${100 / cardsToShow}%` }}
            >
              <p>"{r.text}"</p>
              <h4>- {r.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
