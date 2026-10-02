import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import FeaturedWork from "../components/FeaturedWork";
import HanssenPortfolioPage from "./HanssenPortfolioPage";
import { ProjectTransitionProvider } from "../components/ProjectTransition";
import { PortfolioThemeProvider } from "../components/PortfolioTheme";
import { posts } from "../data/posts";
import { projects } from "../data/projects";

vi.mock("../components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));

function setup(path = "/") {
  return render(<MemoryRouter initialEntries={[path]}><PortfolioThemeProvider><ProjectTransitionProvider><HanssenPortfolioPage /></ProjectTransitionProvider></PortfolioThemeProvider></MemoryRouter>);
}

function setupFeatured() {
  return render(<MemoryRouter><PortfolioThemeProvider><ProjectTransitionProvider><FeaturedWork /></ProjectTransitionProvider></PortfolioThemeProvider></MemoryRouter>);
}

test("featured slides update the visible project link and wrap in both directions", () => {
  setupFeatured();
  expect(screen.getByRole("link", { name: "선택한 프로젝트 보기" })).toHaveAttribute("href", "/projects/graphic-visual");
  fireEvent.click(screen.getByRole("button", { name: "다음 대표 작업" }));
  expect(screen.getByRole("link", { name: "선택한 프로젝트 보기" })).toHaveAttribute("href", "/projects/analyst");
  fireEvent.click(screen.getByRole("button", { name: "이전 대표 작업" }));
  fireEvent.click(screen.getByRole("button", { name: "이전 대표 작업" }));
  expect(screen.getByRole("link", { name: "선택한 프로젝트 보기" })).toHaveAttribute("href", "/projects/bloomingbit-alpha");
});

test("all published projects are linked while upcoming work is identified", () => {
  setup("/work");
  for (const project of projects.filter((p) => !p.upcoming)) expect(screen.getByRole("link", { name: project.cardTitle ?? project.title })).toHaveAttribute("href", `/projects/${project.slug}`);
  expect(screen.queryByRole("link", { name: "나 대신 활동하는 AI 에이전트 만들기" })).not.toBeInTheDocument();
  expect(screen.getByText("Coming soon")).toBeInTheDocument();
});

test("menu closes on Escape and restores focus to its trigger", () => {
  setup();
  const trigger = screen.getByLabelText("메뉴 열기");
  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "사이트 메뉴" });
  expect(dialog).toBeInTheDocument();
  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test("theme control updates its state and portfolio theme", () => {
  const { container } = setup();
  fireEvent.click(screen.getByRole("button", { name: "다크 모드" }));
  expect(container.querySelector(".portfolio-app")).toHaveClass("is-dark");
  expect(screen.getByRole("button", { name: "라이트 모드" })).toHaveAttribute("aria-pressed", "true");
});

test("swiping the hero changes the slide without opening its project", () => {
  const { container } = setupFeatured();
  const hero = screen.getByRole("link", { name: "선택한 프로젝트 보기" });
  fireEvent(hero, new MouseEvent("pointerdown", { bubbles: true, clientX: 220, clientY: 200 }));
  fireEvent(hero, new MouseEvent("pointerup", { bubbles: true, clientX: 80, clientY: 205 }));
  fireEvent.click(hero);
  expect(hero).toHaveAttribute("href", "/projects/analyst");
  expect(container.querySelector(".project-transition-cover")).not.toBeInTheDocument();
});

test("mobile menu traps keyboard focus and restores the body scroll setting", () => {
  setup();
  fireEvent.click(screen.getByLabelText("메뉴 열기"));
  const dialog = screen.getByRole("dialog", { name: "사이트 메뉴" });
  const controls = [...dialog.querySelectorAll("a,button")];
  expect(document.body.style.overflow).toBe("hidden");
  controls.at(-1).focus();
  fireEvent.keyDown(dialog, { key: "Tab" });
  expect(controls[0]).toHaveFocus();
  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(document.body.style.overflow).toBe("");
});

test("home keeps introduction beside the projects and notes panel", () => {
  const { container } = setup();
  expect(screen.getByRole("complementary", { name: "윤미래 소개" })).toBeInTheDocument();
  const panel = container.querySelector(".h-content");
  expect(panel.querySelectorAll(".h-project-card")).toHaveLength(projects.length);
  expect(panel.querySelectorAll(".h-note-card")).toHaveLength(Math.min(posts.length, 3));
  expect(container.querySelector(".home-rail")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Work" })).toBeInTheDocument();
});

test("home GNB follows actual document scrolling", () => {
  const { container } = setup();
  const header = container.querySelector(".h-navigation");
  fireEvent.wheel(window, { deltaY: 100 });
  expect(header).toHaveAttribute("data-compact", "false");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 150 });
  fireEvent.scroll(window);
  expect(header).toHaveAttribute("data-compact", "true");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  fireEvent.scroll(window);
  expect(header).toHaveAttribute("data-compact", "false");
});

test("work uses document scrolling to compact the GNB", () => {
  const { container } = setup("/work");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 150 });
  fireEvent.scroll(window);
  expect(container.querySelector(".h-navigation")).toHaveAttribute("data-compact", "true");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  fireEvent.scroll(window);
  expect(container.querySelector(".h-navigation")).toHaveAttribute("data-compact", "false");
});


test("About centers the introduction and careers without the project sidebar", () => {
  const { container } = setup("/about");
  expect(screen.queryByTestId("interactive-orb")).not.toBeInTheDocument();
  expect(container.querySelector(".h-about-statement")).toHaveTextContent("꼭 필요한 것만 담아 편안한 경험을 만들려 합니다.");
  expect(container.querySelector(".h-about-statement").querySelectorAll("br")).toHaveLength(5);
  expect(container.querySelector(".h-about-centered")).toBeInTheDocument();
  expect(container.querySelector(".h-showcase")).not.toBeInTheDocument();
  expect(container.querySelectorAll(".cai-career-item")).toHaveLength(4);
  fireEvent.click(container.querySelector(".cai-career-summary"));
  expect(container.querySelector(".cai-career-item")).toHaveAttribute("open");
});

 test("work lists every project without an introduction, notes or footer", () => {
  const { container } = setup("/work");
  expect(container.querySelector(".h-info-sidebar")).not.toBeInTheDocument();
  expect(container.querySelector(".h-text-heading")).not.toBeInTheDocument();
  expect(container.querySelectorAll(".h-project-card")).toHaveLength(projects.length);
  expect(screen.queryByRole("link", { name: "View All" })).not.toBeInTheDocument();
  expect(container.querySelector(".h-home-notes")).not.toBeInTheDocument();
  expect(container.querySelector(".h-footer")).not.toBeInTheDocument();
  expect(container.querySelector(".h-showcase")).not.toBeInTheDocument();
});

test("notes index shows the main text list without the old gallery and filters", () => {
  const { container } = setup("/blog");
  expect(screen.getByRole("heading", { name: "Notes", level: 1 })).toBeInTheDocument();
  expect(container.querySelector(".h-showcase")).not.toBeInTheDocument();
  expect(container.querySelector(".blog-filters")).not.toBeInTheDocument();
  expect(container.querySelector(".h-footer")).not.toBeInTheDocument();
  for (const post of posts) {
    expect(screen.getByRole("heading", { name: post.title, level: 2 })).toBeInTheDocument();
    expect(container.querySelector(`a[href="/blog/${post.slug}"]`)).toBeInTheDocument();
  }
});
