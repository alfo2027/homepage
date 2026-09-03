import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const modelPath = `${import.meta.env.BASE_URL}assets/models/westie.glb`;

function WestieModel({ dark, progressRef }) {
  const { scene } = useGLTF(modelPath);
  const model = useMemo(() => scene.clone(true), [scene]);
  const dogRef = useRef(null);
  const hoverRef = useRef(false);
  const dragRef = useRef({ active: false, x: 0, rotation: 0 });
  const head = useMemo(() => model.getObjectByName("HeadPivot"), [model]);
  const tail = useMemo(() => model.getObjectByName("TailPivot"), [model]);

  useEffect(() => {
    model.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.material?.name === "WarmWhiteFur") object.material.color.set(dark ? "#dcd8cf" : "#eee9de");
      if (object.material?.name === "FurShadow") object.material.color.set(dark ? "#c8c2b7" : "#d8d1c4");
    });
  }, [dark, model]);

  useFrame((state) => {
    if (!dogRef.current || !head || !tail) return;
    const progress = progressRef.current || 0;
    const time = state.clock.elapsedTime;
    dogRef.current.rotation.y = dragRef.current.rotation + state.pointer.x * 0.16;
    dogRef.current.position.y = -0.1 + Math.sin(time * 2.2 + progress * 18) * 0.035;
    head.rotation.z = state.pointer.x * -0.13 + Math.sin(time * 1.25) * 0.022;
    head.rotation.x = state.pointer.y * 0.08;
    tail.rotation.z = -0.55 + Math.sin(time * (hoverRef.current ? 11 : 3.5)) * (hoverRef.current ? 0.42 : 0.12);
  });

  const startDrag = (event) => {
    event.stopPropagation();
    event.target.setPointerCapture?.(event.pointerId);
    dragRef.current.active = true;
    dragRef.current.x = event.clientX;
  };
  const moveDrag = (event) => {
    if (!dragRef.current.active) return;
    dragRef.current.rotation += (event.clientX - dragRef.current.x) * 0.014;
    dragRef.current.x = event.clientX;
  };
  const endDrag = () => { dragRef.current.active = false; };

  return (
    <group ref={dogRef} scale={0.84} onPointerOver={() => { hoverRef.current = true; }} onPointerOut={() => { hoverRef.current = false; }} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerLeave={endDrag}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(modelPath);

export default function InteractiveOrb({ dark, progressRef }) {
  const [speaking, setSpeaking] = useState(false);

  return (
    <div
      className={`cai-orb${speaking ? " is-speaking" : ""}`}
      data-cursor="drag"
      data-testid="interactive-orb"
      aria-label="스크롤과 드래그에 반응하는 웨스티 캐릭터"
      aria-describedby="cai-orb-introduction"
      tabIndex="0"
      onMouseEnter={() => setSpeaking(true)}
      onMouseLeave={() => setSpeaking(false)}
      onFocus={() => setSpeaking(true)}
      onBlur={() => setSpeaking(false)}
    >
      <div id="cai-orb-introduction" className="cai-orb-speech" role="status" aria-hidden={!speaking}>
        <span>안녕하세요!</span>
        새로운 기술과 기능을 탐구하는<br />디자이너 윤미래입니다.
      </div>
      <div className="cai-orb-stage">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.08, 4.35], fov: 36 }}>
          <ambientLight intensity={dark ? 1.15 : 1.8} />
          <directionalLight castShadow position={[2.5, 4, 4]} intensity={2.2} />
          <directionalLight position={[-3, 1, 2]} intensity={0.6} />
          <WestieModel dark={dark} progressRef={progressRef} />
          <mesh position={[0, -1.33, -0.08]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.9, 40]} />
            <shadowMaterial transparent opacity={dark ? 0.18 : 0.1} />
          </mesh>
        </Canvas>
      </div>
      <div className="cai-orb-meta" aria-hidden="true">
        <span className="cai-orb-status"><i />HELLO, WESTIE</span>
        <span>PET / DRAG</span>
      </div>
    </div>
  );
}
