import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
type GLTFAction = THREE.AnimationAction;

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh
    mesh_0_1: THREE.Mesh
    mesh_0_2: THREE.Mesh
    mesh_0_3: THREE.Mesh
    mesh_0_4: THREE.Mesh
    mesh_0_5: THREE.Mesh
    mesh_0_6: THREE.Mesh
    mesh_0_7: THREE.Mesh
    mesh_0_8: THREE.Mesh
    mesh_0_9: THREE.Mesh
    mesh_0_10: THREE.Mesh
    mesh_0_11: THREE.Mesh
    mesh_0_12: THREE.Mesh
    mesh_0_13: THREE.Mesh
  }
  materials: {
    ['clear glass']: THREE.MeshStandardMaterial
    ['grass 2d-2']: THREE.MeshStandardMaterial
    ['grass 2d-3']: THREE.MeshStandardMaterial
    ['polished gold']: THREE.MeshStandardMaterial
    ['grass 2d-7']: THREE.MeshStandardMaterial
    ['burnished aluminum']: THREE.MeshStandardMaterial
    ['grass 2d']: THREE.MeshStandardMaterial
    ['grass 2d-4']: THREE.MeshStandardMaterial
    ['grass 2d-6']: THREE.MeshStandardMaterial
    ['clear thick glass']: THREE.MeshStandardMaterial
    color: THREE.MeshStandardMaterial
    ['polished rosewood 2d']: THREE.MeshStandardMaterial
    ['grass 2d-1']: THREE.MeshStandardMaterial
    ['grass 2d-5']: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('src/img/CDS_building.glb') as GLTFResult

    // Modify emissive property of the glass material
    // Set the base color to yellow
  materials['clear thick glass'].color = new THREE.Color(0xffff00); // Bright yellow

  // Add a yellow glow
  materials['clear thick glass'].emissive = new THREE.Color(0xffff00); // Yellow glow
  materials['clear thick glass'].emissiveIntensity = 2.0; // Adjust intensity to your liking

  // Adjust the roughness and metalness for a shiny appearance
  materials['clear thick glass'].roughness = 0.1; // Lower roughness for a smoother surface
  materials['clear thick glass'].metalness = 0.4; // Adjust metalness for reflective properties

  // Ensure the material is transparent
  materials['clear thick glass'].transparent = true;
  materials['clear thick glass'].opacity = 0.5; // Adjust transparency as needed


  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.mesh_0.geometry} material={materials['clear glass']} />
      <mesh geometry={nodes.mesh_0_1.geometry} material={materials['grass 2d-2']} />
      <mesh geometry={nodes.mesh_0_2.geometry} material={materials['grass 2d-3']} />
      <mesh geometry={nodes.mesh_0_3.geometry} material={materials['polished gold']} />
      <mesh geometry={nodes.mesh_0_4.geometry} material={materials['grass 2d-7']} />
      <mesh geometry={nodes.mesh_0_5.geometry} material={materials['burnished aluminum']} />
      <mesh geometry={nodes.mesh_0_6.geometry} material={materials['grass 2d']} />
      <mesh geometry={nodes.mesh_0_7.geometry} material={materials['grass 2d-4']} />
      <mesh geometry={nodes.mesh_0_8.geometry} material={materials['grass 2d-6']} />
      <mesh geometry={nodes.mesh_0_9.geometry} material={materials['clear thick glass']} />
      <mesh geometry={nodes.mesh_0_10.geometry} material={materials.color} />
      <mesh geometry={nodes.mesh_0_11.geometry} material={materials['polished rosewood 2d']} />
      <mesh geometry={nodes.mesh_0_12.geometry} material={materials['grass 2d-1']} />
      <mesh geometry={nodes.mesh_0_13.geometry} material={materials['grass 2d-5']} />
    </group>
  )
}

useGLTF.preload('/CDS_building.glb')
