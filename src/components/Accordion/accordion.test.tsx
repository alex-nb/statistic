import React from "react";
import Accordion, { AccordionProps } from "./Accordion";
import { render, screen } from "@testing-library/react";

const MOCK_PROPS: AccordionProps = {
  items: [
    {
      title: "title_1",
      body: <span>body_1</span>,
    },
    {
      title: "title_2",
      body: <span>body_2</span>,
    },
    {
      title: "title_3",
      body: <span>body_3</span>,
    }
  ]
};

test("display accordion", () => {
  render(<Accordion {...MOCK_PROPS} />);

  expect(screen.getAllByText(/title/i)).toHaveLength(MOCK_PROPS.items.length);
  expect(screen.getAllByText(/body/i)).toHaveLength(MOCK_PROPS.items.length);
});