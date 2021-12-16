import React from "react";
import "./styles.css";

export interface ButtonProps {
  disabled?: boolean;
  label: string;

  onClick?(): void;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { label, disabled } = props;

  const handleOnClick = (): void => {
    props.onClick && !disabled && props.onClick();
  };

  return (
    <button data-testid="button" className={disabled ? "btn btn_disabled" : "btn"} onClick={handleOnClick} disabled={disabled}>
      <span data-testid="span" className="btn__label">{label}</span>
    </button>
  );
};

export default React.memo(Button);
