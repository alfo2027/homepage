import { describe, expect, test } from "vitest";
import { detailProjects, getProjectBySlug, getRelatedProjects, projects } from "./projects";
import { experiences } from "./experience";

describe("project data", () => {
  test("keeps twelve cards with one upcoming project", () => {
    expect(projects).toHaveLength(12);
    expect(projects[0]).toMatchObject({
      slug: "ai-agent",
      title: "AI 에이전트",
      upcoming: true,
    });
    expect(detailProjects).toHaveLength(11);
  });

  test("uses unique semantic slugs", () => {
    const slugs = projects.map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getProjectBySlug("analyst")?.title).toBe(
      "크립토 뉴스 분석 AI 애널리스트",
    );
  });

  test("provides AVIF images for every published detail", () => {
    for (const project of detailProjects) {
      expect(project.images.length).toBeGreaterThan(0);
      expect(project.thumbnail).toMatch(/\.avif$/);
      expect(project.images.every(({ src }) => src.endsWith(".avif"))).toBe(true);
    }
  });

  test("prioritizes same-company work before filling from list order", () => {
    expect(getRelatedProjects("plan-purchase").map(({ slug }) => slug)).toEqual([
      "shipment-report",
      "design-system",
      "schedule-demo",
      "analyst",
    ]);
    expect(getRelatedProjects("dever-partners").map(({ slug }) => slug)).toEqual([
      "dever-order-web",
      "dever-alimtalk",
      "dever-signup",
      "analyst",
    ]);
  });
});

test("keeps four experiences in reverse chronological order", () => {
  expect(experiences.map(({ company }) => company)).toEqual([
    "블루밍비트(Bloomingbit)",
    "트레드링스(TRADLINX)",
    "디버",
    "보내다",
  ]);
});
