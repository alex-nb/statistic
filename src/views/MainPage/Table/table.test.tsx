import React from "react";
import Table, { TableProps } from "./Table";
import { render, screen, fireEvent } from "@testing-library/react";

const MOCK_PROPS: TableProps = {
  lastPage: 3,
  currentPage: 1,
  data: [
    {
      "impressions":16500140,
      "clicks":17732,
      "amount":16.50014,
      "leads":6,
      "lead_price":3.655,
      "revenue":13.5709,
      "net_revenue":0,
      "net_potential":0,
      "ctr":0.107,
      "ecpm":0.001,
      "ecpa":2.75,
      "day":"2019-10-01"
    },
    {
      "impressions":19021111,
      "clicks":19860,
      "amount":19.021111,
      "leads":7,
      "lead_price":49.232,
      "revenue":15.624841,
      "net_revenue":0,
      "net_potential":0,
      "ctr":0.104,
      "ecpm":0.001,
      "ecpa":2.717,
      "day":"2019-10-02"
    },
    {
      "impressions":18053285,
      "clicks":20112,
      "amount":18.053285,
      "leads":12,
      "lead_price":10.897,
      "revenue":14.880962,
      "net_revenue":0,
      "net_potential":0,
      "ctr":0.111,
      "ecpm":0.001,
      "ecpa":1.504,
      "day":"2019-10-03"
    },
  ],
  toPage: jest.fn(),
  setSortTable: jest.fn(),
};

test("display Table", () => {
  render(<Table {...MOCK_PROPS} />);

  expect(MOCK_PROPS.toPage).not.toHaveBeenCalled();
  expect(screen.getAllByTestId("row")).toHaveLength(MOCK_PROPS.data.length);
});

test("to last page", () => {
  render(<Table {...MOCK_PROPS} />);

  fireEvent.click(screen.getByTestId("pages").querySelectorAll("span")[4]);
  expect(MOCK_PROPS.toPage).toHaveBeenCalledWith(MOCK_PROPS.lastPage);
});

test("to first page", () => {
  render(<Table {...MOCK_PROPS} currentPage={3} />);

  fireEvent.click(screen.getByTestId("pages").querySelectorAll("span")[0]);
  expect(MOCK_PROPS.toPage).toHaveBeenCalledWith(1);
});

test("to current page", () => {
  render(<Table {...MOCK_PROPS} />);
  fireEvent.click(screen.getByTestId("pages").querySelectorAll("span")[2]);
  expect(MOCK_PROPS.toPage).toHaveBeenCalledWith(2);
});

test("setSortTable", () => {
  render(<Table {...MOCK_PROPS} />);
  const column = screen.getByTestId("columns").querySelectorAll("th")[0];
  fireEvent.click(column);
  expect(MOCK_PROPS.setSortTable).toHaveBeenCalledWith({column: "day", type: "asc"});
  fireEvent.click(column);
  expect(MOCK_PROPS.setSortTable).toHaveBeenCalledWith({column: "day", type: "desc"});
  fireEvent.click(column);
  expect(MOCK_PROPS.setSortTable).toHaveBeenCalledWith({});
});
