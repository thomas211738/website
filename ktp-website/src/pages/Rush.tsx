import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';
import gsap from 'gsap';
import { ReactLenis } from 'lenis/react';

function Rush() {
  const lenisRef = useRef();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    const handleScroll = (e) => {
      setScrollY(e.scroll); // Update scroll position
    };

    lenisRef.current?.lenis?.on('scroll', handleScroll);
    gsap.ticker.add(update);


  }, []);


  return (
    <ReactLenis root>
      <div className="w-full h-[300vh] relative">
        <Canvas>
          <Scene />
        </Canvas>

        {window.innerWidth >= 1024 && (
          <>
            <div
              className="absolute top-[9.5%] left-[50%] transform -translate-x-1/2 text-white text-[13rem] font-sfpro"
              
            >
              RUSH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KTP
            </div>
            <div
              className="absolute top-[19%] left-[6.5%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro"
            >
              EST 2012
            </div>
            <div
              className="absolute top-[19%] left-[41.5%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro"
            >
              BOSTON
            </div>
            <div
              className="absolute top-[19%] right-[28.75%] transform translate-x-1/2 text-white text-[0.8rem] font-sfpro"
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
    </ReactLenis>
  );
}

export default Rush;
