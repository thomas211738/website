import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Model } from './CDS_building';
import { Sky, Stars } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

function Scene() {
  const { camera } = useThree();
  const buildingRef = useRef<THREE.Group>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // OPTIONAL: If you need to ensure the camera starts at a specific position
    // and orientation from the get-go, set them here once:
    let x = 450;
    let y = 20;
    let z = 350;

    camera.position.set(x, y, z); // "Above and to the right" start
    camera.lookAt(0, -200, 0);

    // Create a timeline for the camera movement
    const tl = gsap.timeline({
      scrollTrigger: {
        // Since your "Rush" page is 500vh tall,
        // you can use the entire page as the trigger.
        trigger: document.body,  
        start: 'top top',        // when the top of the page hits the top of the viewport
        end: '100%',    // when the bottom of the page hits the bottom of the viewport
        scrub: true,             // smooth scrubbing
        invalidateOnRefresh: true,
      },
    });

    const handleVisibilityChange = () => {
      // If the tab is now visible, refresh ScrollTrigger
      if (!document.hidden) {
        ScrollTrigger.refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // We’ll animate a parameter called `progress` from 0 to 1 across scroll
    tl.to({ progress: 0 }, {
      duration: 1,
      progress: 1,
      onUpdate: function () {
        const progress = this.targets()[0].progress;

        // Compute the camera's position based on the initial position and progress
        const startX = 450;
        const startY = 20;
        const startZ = 350;

        const endX = -100;
        const endY = 100;
        const endZ = 350;

        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;
        const z = startZ + (endZ - startZ) * progress;

        // Update camera’s position and look at the building
        camera.position.set(x, y, z);

        const cameray = -200 + (progress * 700);
        const camerax = (progress * 50);
        camera.lookAt(camerax, cameray, 0);

      },
    });

    // Cleanup on unmount if needed
    return () => {
      tl.kill();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [camera]);

  return (
    <>
      {/* Starry sky with a large radius */}
      <Stars radius={300} depth={-50} count={25000} factor={15} fade />

      {/* Subtle sky gradient; tweak turbidity, rayleigh, etc. */}
      <Sky
        distance={4500}
        sunPosition={[50, -10, -50]}
        turbidity={10}
        rayleigh={2}
        inclination={0.8}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      <ambientLight intensity={0.9} />

      <group ref={buildingRef} position={[-50, 0, 50]}>
        <Model position={[30,0,0]} />
      </group>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[3000, 3000]} />
        <meshStandardMaterial color="#6d7c8f" />
      </mesh>
    </>
  );
}

export default Scene;
