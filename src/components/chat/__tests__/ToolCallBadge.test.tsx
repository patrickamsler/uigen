import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// str_replace_editor labels

test("shows Creating label for str_replace_editor create command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/Button.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
});

test("shows Editing label for str_replace_editor str_replace command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/src/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows Editing label for str_replace_editor insert command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/src/Component.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing Component.jsx")).toBeDefined();
});

test("shows Reading label for str_replace_editor view command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "/src/utils.js" }}
      state="call"
    />
  );
  expect(screen.getByText("Reading utils.js")).toBeDefined();
});

test("shows Undoing edit for str_replace_editor undo_edit command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "undo_edit" }}
      state="call"
    />
  );
  expect(screen.getByText("Undoing edit")).toBeDefined();
});

test("shows fallback for str_replace_editor with unknown command", () => {
  render(
    <ToolCallBadge toolName="str_replace_editor" args={{}} state="call" />
  );
  expect(screen.getByText("Running str_replace_editor")).toBeDefined();
});

// file_manager labels

test("shows Renaming label for file_manager rename command", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "rename", path: "/src/Old.jsx", new_path: "/src/New.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Renaming Old.jsx → New.jsx")).toBeDefined();
});

test("shows Deleting label for file_manager delete command", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/src/Card.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Deleting Card.jsx")).toBeDefined();
});

test("shows fallback for file_manager with unknown command", () => {
  render(
    <ToolCallBadge toolName="file_manager" args={{}} state="call" />
  );
  expect(screen.getByText("Running file_manager")).toBeDefined();
});

// Unknown tool fallback

test("shows raw tool name for unknown tools", () => {
  render(
    <ToolCallBadge toolName="some_other_tool" args={{}} state="call" />
  );
  expect(screen.getByText("some_other_tool")).toBeDefined();
});

// State-based rendering

test("shows spinner when state is not result", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/Button.jsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
});

test("shows green dot and no spinner when state is result", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/Button.jsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// Basename extraction from nested paths

test("extracts just the filename from a nested path", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/deep/nested/path/MyComponent.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating MyComponent.tsx")).toBeDefined();
});
