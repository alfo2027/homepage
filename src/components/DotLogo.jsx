import "./DotLogo.css";

// A compact diamond opens into an eight-dot orbit on interaction.
const scattered = Array.from({ length: 13 }, (_, index) => {
  const angle = -Math.PI / 2 + (index % 8) * Math.PI / 4;
  return [Math.cos(angle) * 16, Math.sin(angle) * 16];
});
const gathered = [[0,-14],[-7,-7],[0,-7],[7,-7],[-14,0],[-7,0],[0,0],[7,0],[14,0],[-7,7],[0,7],[7,7],[0,14]];

export default function DotLogo() {
  return <svg className="dot-logo" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <g className="dot-logo-orbit">{scattered.map(([x, y], index) => {
      const [endX, endY] = gathered[index];
      const size = endX === 0 && endY === 0 ? 3.2 : Math.abs(endX) + Math.abs(endY) === 14 ? 1.7 : 2.4;
      return <circle key={index} cx="24" cy="24" r="1" style={{ "--dot-x": `${x}px`, "--dot-y": `${y}px`, "--dot-end-x": `${endX}px`, "--dot-end-y": `${endY}px`, "--dot-size": size, "--dot-rest-opacity": index < 8 ? 1 : 0, "--dot-delay": `${index % 4 * 12}ms` }} />;
    })}</g>
  </svg>;
}
