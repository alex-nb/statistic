import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconArrowDropDown, IconCross } from "../Svg/Svg";
import "./styles.css";

export interface SelectProps {
  label: string;
  options: Option[];
  value?: string;
  clearable?: boolean;
  searchable?: boolean;
  disabled?: boolean;

  onChange(value?: string): void;
}

export interface Option {
  value: string;
  label: string;
}

interface StyleDropdown {
  top: number;
  left: number;
  width?: number;
  visibility: "hidden" | "visible";
}

const Select: React.FC<SelectProps> = (props) => {
  const { options, disabled, searchable, value, onChange } = props;

  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clearRef = useRef<HTMLDivElement>(null);
  const initialStyle: StyleDropdown = {
    top: 0,
    left: 0,
    width: selectRef.current?.offsetWidth,
    visibility: "hidden"
  };

  const [searchValue, setSearchValue] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownStyle, setDropdownStyle] = useState<StyleDropdown>(initialStyle);

  const removeEventListeners = (): void => {
    document.removeEventListener("mousedown", handleOutsideClick);
    document.removeEventListener("wheel", handleOutsideScroll);
    window.removeEventListener("resize", calculateDropdownPosition);
  };

  const addEventListeners = (): void => {
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("wheel", handleOutsideScroll);
    window.addEventListener("resize", calculateDropdownPosition);
  };

  useEffect(() => {
    if (!dropdownOpen) {
      removeEventListeners();
      setDropdownStyle(initialStyle);
      return;
    }

    calculateDropdownPosition();
    addEventListeners();

    return (): void => {
      removeEventListeners();
    };
  }, [dropdownOpen]);

  const handleOutsideClick = (e: MouseEvent): void => {
    if (!selectRef.current || !dropdownRef.current) return;

    if (
      !selectRef.current.contains(e.target as HTMLElement) &&
      !dropdownRef.current.contains(e.target as HTMLElement)
    ) {
      setDropdownOpen(false);
    }
  };

  const handleOutsideScroll = (e: MouseEvent): void => {
    if (!dropdownRef.current?.contains(e.target as HTMLElement)) {
      setDropdownOpen(false);
    }
  };

  /* Расчет позиции выпадющего списка */
  const calculateDropdownPosition = (): void => {
    if (selectRef.current && dropdownRef.current) {
      const position = selectRef.current.getBoundingClientRect();
      const rootRect = document.querySelector("body")?.getBoundingClientRect();
      const heightDropdown = dropdownRef.current.offsetHeight;
      const heightBody = document.body.clientHeight;
      /* Расчитываем расстояние от верха */
      const top =
        position.top + position.height + heightDropdown > heightBody
          ? position.top - heightDropdown - 10
          : position.top + position.height;
      /* Расчитываем расстояние слева */
      const left = rootRect && rootRect.left < 0 ? position.left - rootRect.left : position.left;
      setDropdownStyle({
        top,
        left: left,
        width: position.width,
        visibility: "visible"
      });
    }
  };

  const getSearchableOptions = (): Option[] => {
    if (!searchable) {
      return options;
    }

    return options.filter((option: Option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
  };

  const getLabelOption = (value?: string): string => {
    if (!value) {
      return "";
    }
    const option = options.find(opt => opt.value === value);
    if (option) {
      return option.label;
    }
    return "";
  };

  const handleContainerClick = (e: React.MouseEvent): void => {
    if (!disabled && !clearRef.current?.contains(e.target as HTMLDivElement)) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleOptionClick = (value: string): void => {
    setDropdownOpen(false);
    onChange(value);
  };

  const handleClearClick = (): void => {
    if (!disabled) {
      onChange(undefined);
    }
  };

  const renderClearIcon = (): React.ReactElement => {
    if (props.clearable && value) {
      return (
        <div data-testid="clearIcon" className="select__icon select__icon_clear" ref={clearRef} onClick={handleClearClick}>
          <IconCross />
        </div>
      );
    }

    return <React.Fragment />;
  };

  const onSearchHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const renderSearch = (): React.ReactElement => {
    if (searchable) {
      const className = searchValue ? "select__search select__search_shrink" : "select__search";
      return (
        <label className={className}>
          <div className="select__search__label">Поиск по списку</div>
          <input
            data-testid="searchInput"
            type="text"
            value={searchValue}
            className="select__search__input"
            onChange={onSearchHandler}
          />
        </label>
      );
    }

    return <React.Fragment />;
  };

  const renderListOptions = (): React.ReactElement[] => {
    return getSearchableOptions().map((option: Option, index: number) => {
      const isSelected = value === option.value;
      let classNameItem = "select__options__item";
      if (isSelected) classNameItem += " select__options__item_selected";

      return (
        <div
          data-testid="option"
          key={index}
          className={classNameItem}
          onClick={(): void => handleOptionClick(option.value)}
        >
          <div className="select__options__label">{option.label}</div>
        </div>
      );
    });
  };

  const renderDropdown = (): React.ReactElement => {
    if (dropdownOpen) {
      return createPortal(
        <div id="select-options" className="select__dropdown" style={dropdownStyle} ref={dropdownRef}>
          {renderSearch()}
          <div className="select__options__list">{renderListOptions()}</div>
        </div>,
        document.getElementById("root") as HTMLElement
      );
    }

    return <React.Fragment />;
  };

  const getClassNameSelect = (): string => {
    let classNameSelect = "select";
    if (value) classNameSelect += " select_shrink";
    if (dropdownOpen) classNameSelect += " select_open";
    if (disabled) classNameSelect += " select_disabled";
    return classNameSelect;
  };

  return (
    <div className={getClassNameSelect()} ref={selectRef}>
      <div data-testid="container" className="select__container" onClick={handleContainerClick}>
        <div data-testid="selectLabel" className="select__label">{props.label}</div>
        <div data-testid="optionLabel" className="select__value">{getLabelOption(value)}</div>
        {renderClearIcon()}
        <div className="select__icon select__icon_caret">
          <IconArrowDropDown />
        </div>
      </div>
      {renderDropdown()}
    </div>
  );
};

export default Select;
