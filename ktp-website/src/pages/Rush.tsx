import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';

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
      <div className="w-full h-screen bg-red-500" />
    </>
  );
}

export default Rush;
