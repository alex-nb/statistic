import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { render, screen } from "@testing-library/react";

const Throws = () => {
  throw new Error("Oh no!")
};

test("shows children", () => {
  render(<ErrorBoundary><span>span</span></ErrorBoundary>);
  expect(screen.queryByText("span")).toBeDefined();
  expect(screen.queryByText("Oh no!")).toBeNull();
});

test("shows the fallback when there's an error", () => {
  render(<ErrorBoundary><Throws /><span>span</span></ErrorBoundary>);
  expect(screen.queryByText("span")).toBeNull();
  expect(screen.queryByText("Oh no!")).toBeDefined();
});
