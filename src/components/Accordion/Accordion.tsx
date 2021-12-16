import React, { ReactElement } from "react";
import { IconArrowDropDown } from "../Svg/Svg";
import "./styles.css";

export interface AccordionProps {
  items: Accordion[];
}

interface Accordion {
  title: string;
  body: ReactElement;
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <React.Fragment>
      {items.map((item, index) => (
        <details className="accordion" key={index}>
          <summary className="accordion__summary">
            {item.title}
            <div className="accordion__summary-icon">
              <IconArrowDropDown />
            </div>
          </summary>
          <div className="accordion__body">
            {item.body}
          </div>
        </details>
      ))}
    </React.Fragment>
  );
};

export default Accordion;
