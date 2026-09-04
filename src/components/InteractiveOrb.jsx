import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const DOG_MESSAGES = [
  "오늘 하루는 어떠셨나요?",
  "오늘 좋은 일이 하나쯤 있었나요?",
  "여기까지 와줘서 고마워요.",
  "오늘도 충분히 잘하고 있어요.",
  "물은 잘 챙겨 마셨나요?",
  "별일 없는 하루도 좋은 하루예요.",
  "방금 좋은 냄새가 난 것 같은데…",
  "산책 가기 딱 좋은 날씨네요.",
  "간식 생각은 안 하려고 했는데요.",
  "저는 작은 것에도 잘 행복해져요.",
  "방금 꼬리가 조금 흔들렸어요.",
  "가끔은 아무것도 안 하는 게 일이에요.",
  "저는 오늘도 제법 바빴답니다.",
  "모르는 척하고 있었지만 다 보고 있었어요.",
  "아직 가지 마세요. 조금 더 있어도 돼요.",
  "만나서 반가워요. 진짜로요.",
  "주인님은 예쁜 공간을 발견하면 꽤 오래 둘러봐요.",
  "주인님은 전시 얼리버드를 제법 꼼꼼히 챙긴답니다.",
  "깨끗하게 비워진 공간을 보면 주인님은 마음이 편해진대요.",
  "요즘 주인님은 AI로 새로운 걸 만들어보는 데 푹 빠졌어요.",
  "사실 이 페이지도 주인님이 AI와 함께 만들고 있답니다.",
];

const randomDelay = (minimum, maximum) => minimum + Math.random() * (maximum - minimum);

function shuffledMessages() {
  const messages = [...DOG_MESSAGES];
  for (let index = messages.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [messages[index], messages[target]] = [messages[target], messages[index]];
  }
  return messages;
}

function Fur({ dark, shade = false }) {
  const color = shade ? (dark ? "#c9c5bc" : "#ded9cf") : (dark ? "#e2dfd7" : "#f4f1ea");
  return <meshStandardMaterial color={color} roughness={0.9} />;
}

function SimplifiedWestie({ dark, progressRef }) {
  const dogRef = useRef(null);
  const headRef = useRef(null);

  useFrame((state) => {
    if (!dogRef.current || !headRef.current) return;
    const time = state.clock.elapsedTime;
    const progress = progressRef.current || 0;
    dogRef.current.rotation.y = state.pointer.x * 0.08;
    dogRef.current.position.y = 0.08 + Math.sin(time * 2 + progress * 16) * 0.025;
    headRef.current.rotation.z = state.pointer.x * -0.08 + Math.sin(time * 1.2) * 0.025;
    headRef.current.rotation.x = state.pointer.y * 0.035;
  });

  return (
    <group ref={dogRef} scale={0.92}>
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
  const [message, setMessage] = useState("");
  const [speechCycle, setSpeechCycle] = useState(0);
  const [reacting, setReacting] = useState(false);
  const [surprise, setSurprise] = useState("");
  const triggerSpeechRef = useRef(null);
  const reactionTimerRef = useRef(null);
  const clickLockedRef = useRef(false);

  useEffect(() => {
    let timer;
    let deadline = 0;
    let remaining = 0;
    let pendingCallback;
    let messageQueue = shuffledMessages();

    const schedule = (callback, delay) => {
      pendingCallback = callback;
      remaining = delay;
      deadline = Date.now() + delay;
      timer = window.setTimeout(callback, delay);
    };

    const hideMessage = () => {
      setSpeaking(false);
      schedule(showMessage, randomDelay(8000, 13000));
    };

    const showMessage = () => {
      window.clearTimeout(timer);
      if (messageQueue.length === 0) messageQueue = shuffledMessages();
      setMessage(messageQueue.shift());
      setSpeechCycle((cycle) => cycle + 1);
      setSpeaking(true);
      schedule(hideMessage, 4500);
    };

    triggerSpeechRef.current = showMessage;

    const handleVisibility = () => {
      if (document.hidden) {
        window.clearTimeout(timer);
        remaining = Math.max(0, deadline - Date.now());
      } else if (pendingCallback) {
        schedule(pendingCallback, remaining);
      }
    };

    schedule(showMessage, randomDelay(3000, 5000));
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(timer);
      triggerSpeechRef.current = null;
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(reactionTimerRef.current), []);

  const greet = () => {
    if (clickLockedRef.current) return;
    clickLockedRef.current = true;
    setReacting(true);
    setSurprise(Math.random() < 0.22 ? (Math.random() < 0.5 ? "♥" : "✦") : "");
    triggerSpeechRef.current?.();
    window.clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = window.setTimeout(() => {
      setReacting(false);
      setSurprise("");
      clickLockedRef.current = false;
    }, 700);
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    greet();
  };

  return (
    <div className={`cai-orb${speaking ? " is-speaking" : ""}${reacting ? " is-reacting" : ""}`} data-cursor="pointer" data-testid="interactive-orb" aria-label="클릭하면 인사하는 웨스티 캐릭터" aria-describedby="cai-orb-introduction" role="button" tabIndex="0" onClick={greet} onKeyDown={handleKeyDown}>
      <div id="cai-orb-introduction" className={`cai-orb-speech speech-cycle-${speechCycle % 2}`} role="status" aria-live="polite" aria-atomic="true" aria-hidden={!speaking}>
        {message}
      </div>
      {surprise && <span className="cai-orb-surprise" aria-hidden="true">{surprise}</span>}
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
