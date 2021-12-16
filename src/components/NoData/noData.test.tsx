import React from "react";
import NoData, { NoDataProps } from "./NoData";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const MOCK_PROPS: NoDataProps = {
  title: "title",
  text: "text",
};

test("display NoData", () => {
  render(<NoData {...MOCK_PROPS} />);

  expect(screen.getAllByText(/title/i)).toHaveLength(1);
  expect(screen.getAllByText(/text/i)).toHaveLength(1);
});
