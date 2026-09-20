"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    brand: "HP",
    image:
      "https://images.unsplash.com/photo-1583223675798-3dce4ddf071a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "MacBook",
    image:
      "https://images.unsplash.com/photo-1491472253230-a044054ca35f?q=80&w=884&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "Samsung",
    image:
      "https://images.unsplash.com/photo-1601342733112-8e8c09698f2f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "MSI",
    image:
      "https://images.unsplash.com/photo-1729934746949-1656fbb47006?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "Razer",
    image:
      "https://images.unsplash.com/photo-1605134513573-384dcf99a44c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    brand: "Premium",
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Laptops() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section
      aria-label="Laptop showcase"
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
            The power within your hands
          </h1>

          <p
            style={{
              margin: "0 0 28px",
              maxWidth: "500px",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.6,
            }}
          >
            Discover premium laptops from HP, Dell, MacBook, Samsung, MSI, Razer
            and other top-tier brands built for speed, creativity, and
            performance.
          </p>

          <Link href="/products?q=laptops">
            <button
              type="button"
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "16px 28px",
                fontSize: "1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffb703 0%, #f97316 100%)",
                color: "#111827",
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(249, 115, 22, 0.35)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              Shop Laptops
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
            aria-label={`Show ${slide.brand} laptop slide`}
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
