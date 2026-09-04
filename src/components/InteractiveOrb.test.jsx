import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import InteractiveOrb from "./InteractiveOrb";
import "../concepts/cai.css";

const { mockUseGLTF } = vi.hoisted(() => {
  const loader = vi.fn(() => ({
    scene: {
      clone: () => ({
        getObjectByName: () => ({ rotation: { x: 0, y: 0, z: 0 } }),
        traverse: () => {},
      }),
    },
  }));
  loader.preload = vi.fn();
  return { mockUseGLTF: loader };
});

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }) => <div data-testid="webgl-canvas">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  MeshDistortMaterial: () => <div data-testid="distort-material" />,
  useGLTF: mockUseGLTF,
}));

describe("InteractiveOrb", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("presents the interactive Westie character", () => {
    const progressRef = { current: 0 };
    const { container } = render(<InteractiveOrb dark={false} progressRef={progressRef} />);

    expect(screen.getByLabelText("클릭하면 인사하는 웨스티 캐릭터")).toBeInTheDocument();
    expect(screen.queryByText("PET / DRAG")).not.toBeInTheDocument();
    expect(container.querySelector(".cai-orb-meta")).not.toBeInTheDocument();
    expect(container.querySelector(".cai-orb-stage")).toBeInTheDocument();
    expect(container.querySelector('[name="WestieHead"]')).toBeInTheDocument();
    expect(container.querySelector('[name="WestieMuzzle"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[name="WestieEye"]')).toHaveLength(2);
    expect(container.querySelectorAll("conegeometry")).toHaveLength(0);
    expect(mockUseGLTF).not.toHaveBeenCalled();
  });

  test("does not reveal the old introduction on hover or focus", () => {
    const progressRef = { current: 0 };
    render(<InteractiveOrb dark={false} progressRef={progressRef} />);

    const character = screen.getByLabelText("클릭하면 인사하는 웨스티 캐릭터");
    const speech = screen.getByRole("status", { hidden: true });
    expect(speech).toHaveAttribute("aria-hidden", "true");

    fireEvent.mouseEnter(character);
    expect(speech).toHaveAttribute("aria-hidden", "true");

    fireEvent.focus(character);
    expect(speech).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByText("안녕하세요!")).not.toBeInTheDocument();
  });

  test("greets immediately with a small surprise when clicked", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const progressRef = { current: 0 };
    const { container } = render(<InteractiveOrb dark={false} progressRef={progressRef} />);

    const character = screen.getByLabelText("클릭하면 인사하는 웨스티 캐릭터");
    const speech = screen.getByRole("status", { hidden: true });
    fireEvent.click(character);

    expect(speech).toHaveAttribute("aria-hidden", "false");
    expect(speech).not.toHaveTextContent("");
    expect(character).toHaveClass("is-reacting");
    expect(container.querySelector(".cai-orb-surprise")).toHaveClass("is-heart");
    expect(character).toHaveAttribute("data-cursor", "pointer");

    act(() => vi.advanceTimersByTime(749));
    expect(character).toHaveClass("is-reacting");

    act(() => vi.advanceTimersByTime(1));
    expect(character).not.toHaveClass("is-reacting");
  });

  test("speaks a shuffled message after a gentle random delay", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const progressRef = { current: 0 };
    render(<InteractiveOrb dark={false} progressRef={progressRef} />);

    const speech = screen.getByRole("status", { hidden: true });
    expect(speech).toHaveAttribute("aria-live", "polite");
    expect(speech).toHaveAttribute("aria-hidden", "true");

    act(() => vi.advanceTimersByTime(2999));
    expect(speech).toHaveAttribute("aria-hidden", "true");

    act(() => vi.advanceTimersByTime(1));
    expect(speech).toHaveAttribute("aria-hidden", "false");
    expect(speech).toHaveTextContent("오늘 좋은 일이 하나쯤 있었나요?");
    expect(speech.closest(".cai-orb")).toHaveClass("is-speaking");

    act(() => vi.advanceTimersByTime(4500));
    expect(speech).toHaveAttribute("aria-hidden", "true");

    act(() => vi.advanceTimersByTime(8000));
    expect(speech).toHaveAttribute("aria-hidden", "false");
    expect(speech).toHaveTextContent("여기까지 와줘서 고마워요.");
  });

  test("anchors a readable dark cloud bubble above the Westie", () => {
    const progressRef = { current: 0 };
    const { container } = render(<InteractiveOrb dark={false} progressRef={progressRef} />);
    const speech = container.querySelector(".cai-orb-speech");
    const speechStyle = getComputedStyle(speech);

    expect(speechStyle.top).toBe("auto");
    expect(speechStyle.bottom).toBe("128px");
    expect(speechStyle.left).toBe("calc(50% + 18px)");
    expect(speechStyle.width).toBe("220px");
    expect(speechStyle.textWrap).toBe("balance");
    expect(speechStyle.fontSize).toBe("14px");
    expect(speechStyle.fontWeight).toBe("400");
    expect(speechStyle.borderRadius).toBe("999px");
    expect(speechStyle.backgroundColor).toBe("rgba(38, 38, 35, 0.9)");
    expect(speechStyle.color).toBe("rgb(247, 246, 242)");
  });
});
