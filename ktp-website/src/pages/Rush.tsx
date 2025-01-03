import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import Scene from '../components/Scene';

function Rush() {
  const [rotation, setRotation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // The page's total scrollable height
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // We’ll normalize scroll progress from 0 to 1
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setScrollProgress(progress);

      // Also rotate the building a bit more aggressively
      setRotation(scrollTop * 0.005);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ width: '100%', height: '2000px' }}>
      {/* 
        Height is large so you can actually scroll. 
        Adjust as desired.
      */}
      <Canvas camera={{ position: [250, 120, 250], fov: 50 }}>
        <Scene rotation={rotation} scrollProgress={scrollProgress} />
      </Canvas>
      <div style={{ marginTop: '1200px', textAlign: 'center' }}>
        <h2>Keep scrolling to see the effect!</h2>
      </div>
    </div>
  );
}

export default Rush;
