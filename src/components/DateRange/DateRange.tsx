import React, { ChangeEvent, useEffect, useState } from "react";
import "./styles.css";

export interface DateRangeProps {
  value: DateValue;

  onChange(value: DateValue): void;
}

export interface DateValue {
  monthFrom: string;
  monthTo: string;
}

const DateRange: React.FC<DateRangeProps> = ({ value, onChange }) => {
  const [monthFrom, setMonthFrom] = useState<string>("");
  const [monthTo, setMonthTo] = useState<string>("");

  /* При обновлении передаваемого значения, устанавливаем value во внутренний стейт */
  useEffect(() => {
    if (value.monthFrom) {
      const newMonthFrom = new Date(value.monthFrom).toISOString().slice(0, 7);
      newMonthFrom !== monthFrom && setMonthFrom(newMonthFrom);
    }
    if (value.monthFrom) {
      const newMonthTo = new Date(value.monthTo).toISOString().slice(0, 7);
      newMonthTo !== monthTo && setMonthTo(newMonthTo);
    }
  }, [value]);

  const validateMonth = (month: string): boolean => {
    if (month.length > 2 || Number(month) > 12 || month[0] && Number(month[0]) > 1) {
      return false;
    }

    return !(month[0] && month[1] && Number(month[0]) > 1 && Number(month[1]) > 2);
  };

  const validateYear = (year: string): boolean => {
    return !(year && year.length > 4);
  };

  const validateDate = (value: DateValue): boolean => {
    if (!value.monthTo && !value.monthFrom) {
      return false;
    }
    return !(value.monthFrom.length !== 7 || value.monthTo.length !== 7);
  };

  const callOnChangeHandler = (value: DateValue): void => {
    if (validateDate(value)) {
      onChange({ monthFrom: value.monthFrom, monthTo: value.monthTo });
    }
  };

  const onChangeMonthFrom = (e: ChangeEvent<HTMLInputElement>): void => {
    const newMonthFrom = e.target.value.replace(/[^0-9-]/g, "");
    /* Необходимо для firefox и safari, которые не поддерживают type month */
    const partDate = newMonthFrom.split("-");

    /*Валидируем введенное значение*/
    if (partDate.length > 2 || !validateYear(partDate[0] || "") || !validateMonth(partDate[1] || "")) {
      return;
    }
    setMonthFrom(newMonthFrom);

    let newMonthTo = monthTo;

    /* Проверяем не больше ли стартовое значение даты конечного */
    if (monthTo.length === 7 && new Date(newMonthFrom) > new Date(newMonthTo)) {
      newMonthTo = "";
      setMonthTo(newMonthTo);
    }

    callOnChangeHandler({ monthFrom: newMonthFrom, monthTo: newMonthTo });
  };

  const onChangeMonthTo = (e: ChangeEvent<HTMLInputElement>): void => {
    const newMonthTo = e.target.value.replace(/[^0-9-]/g, "");
    /* Необходимо для firefox и safari, которые не поддерживают type month */
    const partDate = newMonthTo.split("-");

    /*Валидируем введенное значение*/
    if (partDate.length > 2 || !validateYear(partDate[0] || "") || !validateMonth(partDate[1] || "")) {
      return;
    }
    setMonthTo(newMonthTo);
    callOnChangeHandler({ monthFrom, monthTo: newMonthTo });
  };

  return (
    <div className="inputDate__container">
      <input data-testid="monthFrom" className="inputDate" type="month" value={monthFrom} placeholder="YYYY-MM"
             pattern="\d{4}-d{2}"
             onChange={onChangeMonthFrom} />
      <input data-testid="monthTo" className="inputDate" type="month" value={monthTo} min={monthFrom}
             placeholder="YYYY-MM"
             pattern="\d{4}-d{2}"
             onChange={onChangeMonthTo} />
    </div>
  );
};

export default DateRange;
