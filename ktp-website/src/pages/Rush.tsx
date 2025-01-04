import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';

function Rush() {

  return (
    <>
      {/* Add a taller scrollable container */}
      <div className="w-full h-[300vh] relative"> {/* Increased height */}
        <Canvas>
          <Scene />
        </Canvas>
        <div className="absolute top-[10.67%] left-1/2 transform -translate-x-1/2 text-white text-[9rem]">
          RUSH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KTP
        </div>
      </div>

      {/* Add a spacer at the bottom for additional scroll space */}
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: 'red',
        }}
      />
    </>
  );
}

export default Rush;
