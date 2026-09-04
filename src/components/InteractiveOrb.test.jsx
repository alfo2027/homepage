import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import InteractiveOrb from "./InteractiveOrb";

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
  test("presents the interactive Westie character", () => {
    const progressRef = { current: 0 };
    const { container } = render(<InteractiveOrb dark={false} progressRef={progressRef} />);

    expect(screen.getByLabelText("스크롤과 드래그에 반응하는 웨스티 캐릭터")).toBeInTheDocument();
    expect(screen.queryByText("PET / DRAG")).not.toBeInTheDocument();
    expect(container.querySelector(".cai-orb-meta")).not.toBeInTheDocument();
    expect(container.querySelector(".cai-orb-stage")).toBeInTheDocument();
    expect(container.querySelector('[name="WestieHead"]')).toBeInTheDocument();
    expect(container.querySelector('[name="WestieMuzzle"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[name="WestieEye"]')).toHaveLength(2);
    expect(mockUseGLTF).not.toHaveBeenCalled();
  });

  test("reveals the character introduction on hover", () => {
    const progressRef = { current: 0 };
    render(<InteractiveOrb dark={false} progressRef={progressRef} />);

    const character = screen.getByLabelText("스크롤과 드래그에 반응하는 웨스티 캐릭터");
    const speech = screen.getByRole("status", { hidden: true });
    expect(speech).toHaveAttribute("aria-hidden", "true");

    fireEvent.mouseEnter(character);
    expect(speech).toHaveAttribute("aria-hidden", "false");

    fireEvent.mouseLeave(character);
    expect(speech).toHaveAttribute("aria-hidden", "true");
  });

  test("reveals the introduction on keyboard focus and describes the character", () => {
    const progressRef = { current: 0 };
    render(<InteractiveOrb dark={false} progressRef={progressRef} />);

    const character = screen.getByLabelText("스크롤과 드래그에 반응하는 웨스티 캐릭터");
    const speech = screen.getByRole("status", { hidden: true });

    expect(character).toHaveAttribute("aria-describedby", "cai-orb-introduction");
    expect(speech).toHaveAttribute("id", "cai-orb-introduction");

    fireEvent.focus(character);
    expect(speech).toHaveAttribute("aria-hidden", "false");

    fireEvent.blur(character);
    expect(speech).toHaveAttribute("aria-hidden", "true");
  });
});
