// src/components/CDSBuilding.tsx
import { useGLTF } from '@react-three/drei';

// NOTE: By default, /public is the root for static files.
// So if your file is in /public/CDS_building.glb, you can load it with '/CDS_building.glb'.
export function CDSBuilding() {
  const { scene } = useGLTF('../src/img/CDS_building.glb');
  return <primitive object={scene} />;
}
