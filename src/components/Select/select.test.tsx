import React from "react";
import Select, { SelectProps } from "./Select";
import { render, screen, fireEvent } from "@testing-library/react";

const MOCK_PROPS: SelectProps = {
  label: "label",
  options: [
    {
      value: "value_1",
      label: "label_1",
    },
    {
      value: "value_2",
      label: "label_2",
    },
    {
      value: "value_3",
      label: "label_3",
    },
  ],
  onChange: jest.fn(),
};

test("display and choose", () => {
  render(<div id="root"><Select {...MOCK_PROPS} /></div>);

  expect(MOCK_PROPS.onChange).not.toHaveBeenCalled();
  expect(screen.getByTestId("selectLabel")).toHaveTextContent(MOCK_PROPS.label);

  fireEvent.click(screen.getByTestId("container"));
  expect(screen.getAllByTestId("option")).toHaveLength(MOCK_PROPS.options.length);

  fireEvent.click(screen.getAllByTestId("option")[0]);
  expect(MOCK_PROPS.onChange).toHaveBeenCalledWith(MOCK_PROPS.options[0].value);
});

test("display and test searchable Select", () => {
  render(<div id="root"><Select {...MOCK_PROPS} searchable={true}/></div>);

  fireEvent.click(screen.getByTestId("container"));
  fireEvent.change(screen.getByTestId("searchInput"), {target: {value: "1"}});
  expect(screen.getAllByTestId("option")).toHaveLength(1);
});

test("display and test clearable Select", () => {
  render(<Select {...MOCK_PROPS} clearable={true} value="value_1" />);
  expect(MOCK_PROPS.onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByTestId("clearIcon"));
  expect(MOCK_PROPS.onChange).toHaveBeenCalledWith(undefined);
});

test("display and test disabled Select", () => {
  render(<Select {...MOCK_PROPS} disabled={true} />);

  fireEvent.click(screen.getByTestId("container"));
  expect(screen.queryByTestId("option")).toBeNull();
});
