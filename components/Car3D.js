import React from 'react'

export default function Car3D({ position = [0, 0.2, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Car body (main) */}
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[1.2, 0.25, 0.5]} />
        <meshStandardMaterial color={'#1976d2'} />
      </mesh>
      {/* Car roof */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.6, 0.18, 0.5]} />
        <meshStandardMaterial color={'#90caf9'} />
      </mesh>
      {/* Front hood */}
      <mesh position={[-0.45, 0.18, 0]}>
        <boxGeometry args={[0.3, 0.12, 0.5]} />
        <meshStandardMaterial color={'#1565c0'} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0.45, 0.18, 0]}>
        <boxGeometry args={[0.3, 0.12, 0.5]} />
        <meshStandardMaterial color={'#1565c0'} />
      </mesh>
      {/* Windows */}
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.48]} />
        <meshStandardMaterial color={'#e3f2fd'} transparent opacity={0.7} />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.62, 0.18, 0.16]}>
        <boxGeometry args={[0.04, 0.04, 0.08]} />
        <meshStandardMaterial color={'#fffde7'} emissive={'#fffde7'} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.62, 0.18, -0.16]}>
        <boxGeometry args={[0.04, 0.04, 0.08]} />
        <meshStandardMaterial color={'#fffde7'} emissive={'#fffde7'} emissiveIntensity={0.8} />
      </mesh>
      {/* Taillights */}
      <mesh position={[0.62, 0.18, 0.16]}>
        <boxGeometry args={[0.04, 0.04, 0.08]} />
        <meshStandardMaterial color={'#ff1744'} emissive={'#ff1744'} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.62, 0.18, -0.16]}>
        <boxGeometry args={[0.04, 0.04, 0.08]} />
        <meshStandardMaterial color={'#ff1744'} emissive={'#ff1744'} emissiveIntensity={0.8} />
      </mesh>
      {/* Wheels */}
      {[[-0.4, 0, 0.22], [0.4, 0, 0.22], [-0.4, 0, -0.22], [0.4, 0, -0.22]].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.18, 20]} />
          <meshStandardMaterial color={'#222'} />
        </mesh>
      ))}
    </group>
  )
}