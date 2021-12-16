import React, { useCallback, useState } from "react";
import Button from "../../../components/Button/Button";
import "./styles.css";

export interface ErrorPageProps {
  title?: string;
  message?: string;
  describeMessage?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title = "Ошибка!", message = "", describeMessage }) => {
  const [stackTraceIsOpen, setStackTraceIsOpen] = useState<boolean>(false);

  const toggleView = () => {
    setStackTraceIsOpen(!stackTraceIsOpen);
  };

  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="errorBoundary">
      <h1 className="errorBoundary__title">{title}</h1>

      <p className="errorBoundary__subtitle">Что-то пошло не так. Попробуйте обновить страницу</p>

      {stackTraceIsOpen && (
        <p className="errorBoundary__details">
          <span className="errorBoundary__details__message">{message}</span>
          {describeMessage || <p>Нет подробной информации</p>}
        </p>
      )}

      <button data-testid="displayButton" className="errorBoundary__button" onClick={toggleView}>
        {stackTraceIsOpen ? "Скрыть" : "Подробнее"}
      </button>

      <Button onClick={refreshPage} label="Обновить страницу" />
    </div>
  );
};

export default React.memo(ErrorPage);
