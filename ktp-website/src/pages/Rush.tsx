import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Rush() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1,
      smooth: true,
      direction: 'vertical',
      gestureDirection: 'vertical',
    });

    // Update the scroll position state on Lenis scroll
    lenis.on('scroll', ({ scroll }) => {
      setScrollY(scroll); // Sync Lenis scroll position to state
      ScrollTrigger.update();
    });

    // Add Lenis to GSAP's ticker
    const lenisRaf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisRaf);

    // Prevent GSAP lag smoothing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
    };
  }, []);

  const textStyle = {
    transform: `translateY(${scrollY * 0.7}px)`,
  };
  const headerStyle = {
    transform: `translateY(${scrollY * 0.65}px)`,
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/lenis@1.1.18/dist/lenis.css"
      ></link>
      <div className="w-full h-[300vh] relative">
        <Canvas>
          <Scene />
        </Canvas>

        {window.innerWidth >= 1024 && (
          <>
            <div
              className="absolute top-[10%] left-[3%] transform -translate-x-1/2 text-white text-[13rem] font-sfpro"
              style={headerStyle}
            >
              RUSH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KTP
            </div>
            <div
              className="absolute top-[20%] left-[4.25%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro"
              style={textStyle}
            >
              EST 2012
            </div>
            <div
              className="absolute top-[20%] left-[39.1%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro"
              style={textStyle}
            >
              BOSTON
            </div>
            <div
              className="absolute top-[20%] right-[27.3%] transform translate-x-1/2 text-white text-[0.8rem] font-sfpro"
              style={textStyle}
            >
              LAMBDA
            </div>
          </>
        )}
      </div>

      <div className="w-full h-screen bg-red-500">
        <div className="text-white text-center text-5xl font-sfpro p-10">
          Learn about joining KTP! <br />
          <span className="text-3xl">Welcome to Spring 2025 Rush!</span>
        </div>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
              Interest Form
            </a>
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200">
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
              Application Link
            </a>
          </button>
        </div>
      </div>
    </>
  );
}

export default Rush;
