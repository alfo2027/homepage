import { useRive } from "@rive-app/react-canvas-lite";

const RIVE_SAMPLE = "https://cdn.rive.app/animations/vehicles.riv";

export default function RiveThemeToggle({ dark, onToggle }) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_SAMPLE,
    stateMachines: "bumpy",
    autoplay: true,
  });

  return (
    <button
      type="button"
      className="cai-rive-toggle"
      data-testid="rive-toggle"
      onClick={onToggle}
      onMouseEnter={() => rive?.play()}
      onMouseLeave={() => rive?.pause()}
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      <span className="cai-rive-canvas" aria-hidden="true"><RiveComponent /></span>
      <span className="cai-rive-label">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
