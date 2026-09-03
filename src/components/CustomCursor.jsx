import { useEffect, useRef, useState } from "react";

const cursorLabels = {
  project: "VIEW ↗",
  link: "↗",
  drag: "DRAG ↔",
};

export default function CustomCursor() {
  const [cursor, setCursor] = useState({ x: 0, y: 0, mode: "default", visible: false });
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      const mode = event.target.closest?.("[data-cursor]")?.dataset.cursor || "default";
      setCursor({ x: event.clientX, y: event.clientY, mode, visible: true });
    };
    const handleScroll = () => {
      const { x, y } = pointerRef.current;
      const target = document.elementFromPoint?.(x, y);
      const mode = target?.closest?.("[data-cursor]")?.dataset.cursor || "default";
      setCursor((current) => ({ ...current, mode }));
    };
    const handlePointerLeave = () => setCursor((current) => ({ ...current, visible: false }));

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("scroll", handleScroll, true);
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("scroll", handleScroll, true);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      className={`cai-cursor is-${cursor.mode}${cursor.visible ? " is-visible" : ""}`}
      data-testid="custom-cursor"
      style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
      aria-hidden="true"
    >
      <span>{cursorLabels[cursor.mode] || ""}</span>
    </div>
  );
}
