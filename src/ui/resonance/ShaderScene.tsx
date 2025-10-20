import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function RotatingBox(){
  const ref = useRef<any>();
  useFrame(({clock})=>{
    if(ref.current){
      ref.current.rotation.x = clock.getElapsedTime()*0.5;
      ref.current.rotation.y = clock.getElapsedTime()*0.7;
    }
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color="#FFD761" />
    </mesh>
  );
}

export default function ShaderScene(){
  return (
    <div className="w-full h-80 bg-oriel-surface rounded-2xl overflow-hidden">
      <Canvas camera={{position:[2,2,2]}}>
        <ambientLight intensity={0.6}/>
        <pointLight position={[3,3,3]} />
        <RotatingBox/>
        <OrbitControls/>
      </Canvas>
    </div>
  );
}
