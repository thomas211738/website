import { useRef } from 'react';
import { OrbitControls, Stars, Float, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CDSBuilding } from '../components/CDSBuilding';

function Scene({ rotation, scrollProgress }) {
  // Refs for the building and text
  const buildingRef = useRef();
  const textRef = useRef();

  // Slowly rotate the floating text
  useFrame((state, delta) => {
    if (textRef.current) {
      textRef.current.rotation.y += delta * 0.5;
    }

    // Example: Adjust building color (or material property) based on scrollProgress
    // This is just a demonstration of changing an emissive color, you can adapt it
    // to your building's materials if you have them:
    if (buildingRef.current) {
      // If your building has multiple children (meshes), you might need to iterate
      // over them or reference the specific mesh material:
      buildingRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.color) {
          // Fade from dark gray to light purple as we scroll
          const colorFactor = scrollProgress; // 0 -> 1
          child.material.color.setHSL(0.7, 0.8, 0.2 * colorFactor);
        }
      });
    }
  });

  return (
    <>
      {/* Stars in the background */}
      <Stars
        radius={100}       // radius of the inner sphere (default=100)
        depth={50}         // depth of area where stars should fit (default=50)
        count={5000}       // amount of stars (default=5000)
        factor={4}         // size factor for stars (default=4)
        saturation={0}     // saturation 0 = no extra color
        fade                // smooth fade to the background
        speed={1}
      />

      {/* Camera controls */}
      <OrbitControls enableZoom={false} />

      {/* Some ambient and directional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Our building */}
      <mesh ref={buildingRef} rotation={[0, rotation, 0]}>
        <CDSBuilding />
      </mesh>

      {/* Floating, rotating text above the building */}
      <Float 
        speed={2}            // Animation speed
        rotationIntensity={1} // Rotate a bit
        floatIntensity={2}    // How high up/down it floats
      >
        <Text
          ref={textRef}
          fontSize={12}
          color='#ffffff'
          position={[0, 70, 0]}
          anchorX='center'
          anchorY='middle'
        >
          Cool Building
        </Text>
      </Float>
    </>
  );
}

export default Scene;
