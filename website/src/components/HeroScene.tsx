"use client";

import { Float, MeshDistortMaterial, Torus } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points as PointsType } from "three";
import * as THREE from "three";

function Particles() {
  const ref = useRef<PointsType>(null);
  const count = 120;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * (0.08 + Math.abs(state.pointer.x) * 0.08);
      ref.current.rotation.x += delta * 0.03;
      ref.current.position.x = THREE.MathUtils.lerp(
        ref.current.position.x,
        state.pointer.x * 0.18,
        0.06,
      );
      ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y,
        state.pointer.y * 0.12,
        0.06,
      );
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ff4d8d"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Notebook() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group} position={[0.8, -0.2, 0]}>
      <mesh rotation={[0.3, -0.4, 0.1]}>
        <boxGeometry args={[0.9, 1.1, 0.08]} />
        <meshStandardMaterial color="#161618" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.05]} rotation={[0.3, -0.4, 0.1]}>
        <planeGeometry args={[0.75, 0.95]} />
        <meshStandardMaterial
          color="#e8e8ea"
          emissive="#ff4d8d"
          emissiveIntensity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Rings() {
  return (
    <>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Torus args={[1.1, 0.012, 16, 80]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial
            color="#3ecf8e"
            emissive="#3ecf8e"
            emissiveIntensity={0.25}
            transparent
            opacity={0.6}
          />
        </Torus>
      </Float>
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <Torus
          args={[0.75, 0.008, 16, 64]}
          rotation={[Math.PI / 3, 0.5, 0]}
          position={[0, 0.2, -0.3]}
        >
          <MeshDistortMaterial
            color="#ff4d8d"
            emissive="#ff4d8d"
            emissiveIntensity={0.15}
            transparent
            opacity={0.45}
            distort={0.15}
            speed={1.5}
          />
        </Torus>
      </Float>
    </>
  );
}

function InteractiveRig() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.32,
      0.06,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.18,
      0.06,
    );
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      state.pointer.x * 0.12,
      0.05,
    );
  });

  return (
    <group ref={group}>
      <Particles />
      <Rings />
      <Notebook />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 2, 2]} intensity={0.8} color="#ff4d8d" />
      <pointLight position={[-2, -1, 1]} intensity={0.5} color="#3ecf8e" />
      <InteractiveRig />
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
