import React from "react";
import { IconCardBulleted } from "../Svg/Svg";
import "./styles.css";

export interface NoDataProps {
  title: string;
  text: string;
}

const NoData: React.FC<NoDataProps> = ({ title, text }) => {
  return (
    <div className="noData">
      <div className="noData__icon">
        <IconCardBulleted />
      </div>
      <div className="noData__title">
        <h1>{title}</h1>
      </div>
      <div className="noData__description">{text}</div>
    </div>
  );
};

export default React.memo(NoData);
