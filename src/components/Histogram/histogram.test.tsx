import React from "react";
import Histogram, { HistogramProps } from "./Histogram";
import { render, screen } from "@testing-library/react";

const MOCK_PROPS: HistogramProps = {
  items: [
    {
      value: 3,
      date: "2019-05-01",
    },
    {
      value: 5,
      date: "2019-05-02",
    },
    {
      value: 2,
      date: "2019-05-03",
    },
  ]
};

test("display Histogram", () => {
  render(<Histogram {...MOCK_PROPS} />);
  expect(screen.getAllByTestId("column")).toHaveLength(MOCK_PROPS.items.length);
  expect(screen.getAllByTestId("division_y")).toHaveLength(10);
  expect(screen.getAllByTestId("division_x")).toHaveLength(1);
});
