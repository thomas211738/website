import React, { useState, useEffect } from "react";
import alpha_professional from "../img/2023 Spring 1.jpg";
import delta_initiation from "../img/delta initiation.jpeg";
import alpha_initiation from "../img/Alpha Initiation.jpg";
// import YouTubeVideo from "./YoutubeVideo";

const ScrollImages = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

  const calculateTransform = (offset, index) => {
    const imageOffset = Math.max(0, scrollY - index * windowHeight);
    return `translateY(${Math.max(windowHeight - imageOffset, 0)}px)`;
  };

  const images = [
    { src: alpha_professional, alt: "Alpha Professional" },
    { src: delta_initiation, alt: "Delta Initiation" },
    { src: alpha_initiation, alt: "Alpha Initiation" },
  ];

  return (
    <div className="relative h-[300vh] flex justify-center items-center">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className={`absolute w-auto h-60 object-cover transition-transform duration-500 ease-in-out ${
            index === 0 ? "z-30" : "z-10"
          }`}
          style={{
            transform: calculateTransform(scrollY, index),
          }}
        />
      ))}

      {/* Position the YouTubeVideo below the images */}
      {/* <div className="absolute bottom-10 w-full">
        <YouTubeVideo />
      </div> */}
    </div>
  );
};

export default ScrollImages;
