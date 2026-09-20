"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    brand: "PlayStation 5",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "Xbox Series X",
    image:
      "https://images.unsplash.com/photo-1683823363200-5857de737eb5?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "Nintendo Switch",
    image:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "Steam Deck",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "Accessories",
    image:
      "https://images.unsplash.com/photo-1664092815283-19c6196f5319?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Gaming() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section
      aria-label="Gaming console showcase"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "520px",
        overflow: "hidden",
        backgroundColor: "#0b1020",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(90deg, rgba(10,12,18,0.82) 0%, rgba(10,12,18,0.5) 40%, rgba(10,12,18,0.2) 100%), url(${activeSlide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.8s ease-in-out",
          filter: "saturate(1.1)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "520px",
          display: "flex",
          alignItems: "center",
          padding: "48px 6vw",
        }}
      >
        <div style={{ maxWidth: "560px", color: "#fff" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "999px",
              padding: "8px 14px",
              fontSize: "12px",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "18px",
              backdropFilter: "blur(10px)",
            }}
          >
            {activeSlide.brand} Collection
          </div>

          <h1
            style={{
              fontSize: "clamp(2.6rem, 5vw, 5rem)",
              lineHeight: 1.05,
              margin: "0 0 18px",
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            Level up your setup
          </h1>

          <p
            style={{
              margin: "0 0 28px",
              maxWidth: "520px",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.6,
            }}
          >
            Discover the latest PlayStation, Xbox, Nintendo Switch, and premium
            gaming gear built for fast action, immersive play, and unforgettable
            co-op nights.
          </p>

          <Link href="/products?q=gaming">
            <button
              type="button"
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "16px 28px",
                fontSize: "1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #7c3aed 0%, #22c55e 100%)",
                color: "#f8fafc",
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(124, 58, 237, 0.35)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              Shop Consoles
            </button>
          </Link>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: "5vw",
          bottom: "32px",
          display: "flex",
          gap: "10px",
          zIndex: 2,
        }}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.brand}
            type="button"
            aria-label={`Show ${slide.brand} console slide`}
            onClick={() => setActiveIndex(index)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              border: "none",
              background:
                index === activeIndex ? "#fff" : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              padding: 0,
              boxShadow:
                index === activeIndex
                  ? "0 0 0 4px rgba(255,255,255,0.15)"
                  : "none",
            }}
          />
        ))}
      </div>
    </section>
  );
}
