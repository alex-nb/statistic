import React from "react";
import ErrorPage, { ErrorPageProps } from "./ErrorPage";
import { render, screen, fireEvent } from "@testing-library/react";

const MOCK_PROPS: ErrorPageProps = {
  title: "title",
  message: "message",
  describeMessage: "describeMessage",
};

test("display ErrorPage", () => {
  render(<ErrorPage {...MOCK_PROPS} />);

  expect(screen.getByText("title")).toBeDefined();
  expect(screen.queryByText("message")).toBeNull();
  expect(screen.queryByText("describeMessage")).toBeNull();


  fireEvent.click(screen.getByTestId("displayButton"));
  expect(screen.getByText("message")).toBeDefined();
  expect(screen.getByText("describeMessage")).toBeDefined();
});
