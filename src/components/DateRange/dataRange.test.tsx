import React from "react";
import DateRange, { DateRangeProps } from "./DateRange";
import { render, screen, fireEvent } from "@testing-library/react";

const MOCK_PROPS: DateRangeProps = {
  value: { monthFrom: "2019-10", monthTo: "2019-12" },
  onChange: jest.fn(),
};

test("display DateRange", () => {
  render(<DateRange {...MOCK_PROPS} />);

  expect(MOCK_PROPS.onChange).not.toHaveBeenCalled();
  expect(screen.getByTestId("monthFrom")).toHaveValue(MOCK_PROPS.value.monthFrom);
  expect(screen.getByTestId("monthTo")).toHaveValue(MOCK_PROPS.value.monthTo);
});

test("onChange invalid", () => {
  render(<DateRange {...MOCK_PROPS} />);
  expect(MOCK_PROPS.onChange).not.toHaveBeenCalled();

  fireEvent.change(screen.getByTestId("monthFrom"), { target: { value: "2020-05" } });
  expect(MOCK_PROPS.onChange).not.toHaveBeenCalled();
  expect(screen.getByTestId("monthFrom")).toHaveValue("2020-05");
  expect(screen.getByTestId("monthTo")).toHaveValue("");
});

test("onChange valid", () => {
  render(<DateRange {...MOCK_PROPS} />);

  expect(MOCK_PROPS.onChange).not.toHaveBeenCalled();
  fireEvent.change(screen.getByTestId("monthFrom"), { target: { value: "2019-05" } });
  expect(MOCK_PROPS.onChange).toHaveBeenCalledWith({ monthFrom: "2019-05", monthTo: MOCK_PROPS.value.monthTo });
});

test("onChange date", () => {
  render(<DateRange {...MOCK_PROPS} />);

  expect(MOCK_PROPS.onChange).not.toHaveBeenCalled();
  fireEvent.change(screen.getByTestId("monthFrom"), { target: { value: "2019-05" } });
  fireEvent.change(screen.getByTestId("monthTo"), { target: { value: "2019-07" } });

  expect(screen.getByTestId("monthFrom")).toHaveValue( "2019-05");
  expect(screen.getByTestId("monthTo")).toHaveValue("2019-07");
});