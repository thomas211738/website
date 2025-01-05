import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';

import sean from '../img/sean delta.jpeg';
import delta_initiation from '../img/delta initiation.jpeg';
import alpha_initiation from '../img/Alpha Initiation.jpg';
import alpha_professional from '../img/2023 Spring 1.jpg';
import panel from '../img/KTPxPCT.JPG';
import the_squad from '../img/the squad.jpeg';
import willow_arya from '../img/willow_arya.jpeg';
import YouTubeVideo from '../components/YoutubeVideo';

import ScrollImages from '../components/ScrollImages';

function Rush() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textStyle = {
    transform: `translateY(${scrollY * 0.7}px)`,
  };

  const headerStyle = {
    transform: `translateY(${scrollY * 0.65}px)`,
  };

  return (
    <>
      {/* Add a taller scrollable container */}
      <div className="w-full h-[300vh] relative">
        {/* Scene */}
        <Canvas>
          <Scene />
        </Canvas>

        {/* Text elements with parallax effect */}
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

      {/* Add a spacer at the bottom for additional scroll space */}
      <div className="w-full h-screen bg-red-500" >
        {/* <div className="text-white text-center text-4xl font-bebasneue p-10">
          
        </div> */}
        <div className="text-white text-center text-5xl font-sfpro p-10">
        Learn about joining KTP! 
          <br />
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

        <ScrollImages/>

      </div>

    </>
  );
}

export default Rush;
