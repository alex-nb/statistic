import React from "react";
import Button, { ButtonProps } from "./Button";
import { render, screen, fireEvent } from "@testing-library/react";

const MOCK_PROPS: ButtonProps = {
  disabled: false,
  label: "label",
  onClick: jest.fn(),
};

test("display button", () => {
  render(<Button {...MOCK_PROPS} />);

  expect(MOCK_PROPS.onClick).not.toHaveBeenCalled();
  expect(screen.getByTestId("span")).toHaveTextContent(MOCK_PROPS.label);

  fireEvent.click(screen.getByTestId("button"));
  expect(MOCK_PROPS.onClick).toHaveBeenCalledTimes(1);
});

test("display disable button", () => {
  render(<Button {...MOCK_PROPS} disabled={true} />);
  fireEvent.click(screen.getByTestId("button"));
  expect(MOCK_PROPS.onClick).not.toHaveBeenCalled();
});