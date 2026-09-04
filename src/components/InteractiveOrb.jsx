import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Fur({ dark, shade = false }) {
  const color = shade ? (dark ? "#c9c5bc" : "#ded9cf") : (dark ? "#e2dfd7" : "#f4f1ea");
  return <meshStandardMaterial color={color} roughness={0.9} />;
}

function SimplifiedWestie({ dark, progressRef }) {
  const dogRef = useRef(null);
  const headRef = useRef(null);
  const dragRef = useRef({ active: false, x: 0, rotation: 0 });

  useFrame((state) => {
    if (!dogRef.current || !headRef.current) return;
    const time = state.clock.elapsedTime;
    const progress = progressRef.current || 0;
    dogRef.current.rotation.y = dragRef.current.rotation + state.pointer.x * 0.08;
    dogRef.current.position.y = 0.08 + Math.sin(time * 2 + progress * 16) * 0.025;
    headRef.current.rotation.z = state.pointer.x * -0.08 + Math.sin(time * 1.2) * 0.025;
    headRef.current.rotation.x = state.pointer.y * 0.035;
  });

  const startDrag = (event) => {
    event.stopPropagation();
    event.target.setPointerCapture?.(event.pointerId);
    dragRef.current.active = true;
    dragRef.current.x = event.clientX;
  };
  const moveDrag = (event) => {
    if (!dragRef.current.active) return;
    dragRef.current.rotation += (event.clientX - dragRef.current.x) * 0.009;
    dragRef.current.x = event.clientX;
  };
  const endDrag = () => { dragRef.current.active = false; };

  return (
    <group ref={dogRef} scale={0.92} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerLeave={endDrag}>
      <mesh position={[0, -1.08, 0]} scale={[0.78, 1.05, 0.58]}>
        <sphereGeometry args={[0.78, 32, 24]} />
        <Fur dark={dark} shade />
      </mesh>
      <group ref={headRef} name="WestieHead">
        <mesh position={[-0.56, 0.67, -0.03]} rotation={[0, 0, -0.16]} scale={[0.62, 1, 0.48]}>
          <coneGeometry args={[0.42, 0.78, 4]} />
          <Fur dark={dark} shade />
        </mesh>
        <mesh position={[0.56, 0.67, -0.03]} rotation={[0, 0, 0.16]} scale={[0.62, 1, 0.48]}>
          <coneGeometry args={[0.42, 0.78, 4]} />
          <Fur dark={dark} shade />
        </mesh>
        <mesh position={[0, 0.05, 0]} scale={[0.98, 0.9, 0.82]}>
          <sphereGeometry args={[0.72, 36, 28]} />
          <Fur dark={dark} />
        </mesh>
        <mesh position={[-0.16, 0.72, 0.12]} scale={[0.22, 0.42, 0.18]} rotation={[0, 0, -0.28]}>
          <sphereGeometry args={[0.5, 20, 16]} />
          <Fur dark={dark} />
        </mesh>
        <mesh position={[0.16, 0.72, 0.12]} scale={[0.22, 0.42, 0.18]} rotation={[0, 0, 0.28]}>
          <sphereGeometry args={[0.5, 20, 16]} />
          <Fur dark={dark} />
        </mesh>
        <mesh name="WestieEye" position={[-0.27, 0.16, 0.61]}>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshStandardMaterial color="#242321" roughness={0.55} />
        </mesh>
        <mesh name="WestieEye" position={[0.27, 0.16, 0.61]}>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshStandardMaterial color="#242321" roughness={0.55} />
        </mesh>
        <mesh name="WestieMuzzle" position={[0, -0.12, 0.62]} scale={[0.5, 0.34, 0.34]}>
          <sphereGeometry args={[0.58, 28, 20]} />
          <Fur dark={dark} shade />
        </mesh>
        <mesh position={[0, -0.05, 0.88]} scale={[1.15, 0.82, 0.72]}>
          <sphereGeometry args={[0.1, 20, 16]} />
          <meshStandardMaterial color="#242321" roughness={0.5} />
        </mesh>
      </group>
      <mesh position={[-0.38, -1.25, 0.48]} scale={[0.3, 0.72, 0.3]}>
        <sphereGeometry args={[0.5, 24, 18]} />
        <Fur dark={dark} />
      </mesh>
      <mesh position={[0.38, -1.25, 0.48]} scale={[0.3, 0.72, 0.3]}>
        <sphereGeometry args={[0.5, 24, 18]} />
        <Fur dark={dark} />
      </mesh>
    </group>
  );
}

export default function InteractiveOrb({ dark, progressRef }) {
  const [speaking, setSpeaking] = useState(false);
  return (
    <div className={`cai-orb${speaking ? " is-speaking" : ""}`} data-testid="interactive-orb" aria-label="스크롤과 드래그에 반응하는 웨스티 캐릭터" aria-describedby="cai-orb-introduction" tabIndex="0" onMouseEnter={() => setSpeaking(true)} onMouseLeave={() => setSpeaking(false)} onFocus={() => setSpeaking(true)} onBlur={() => setSpeaking(false)}>
      <div id="cai-orb-introduction" className="cai-orb-speech" role="status" aria-hidden={!speaking}>
        <span>안녕하세요!</span>
        새로운 기술과 기능을 탐구하는<br />디자이너 윤미래입니다.
      </div>
      <div className="cai-orb-stage">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.08, 4.1], fov: 34 }}>
          <ambientLight intensity={dark ? 1.3 : 2.1} />
          <directionalLight position={[2.5, 4, 4]} intensity={2} />
          <directionalLight position={[-3, 1, 2]} intensity={0.7} />
          <SimplifiedWestie dark={dark} progressRef={progressRef} />
        </Canvas>
      </div>
    </div>
  );
}
