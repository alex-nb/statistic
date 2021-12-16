import React, { useEffect, useRef, useState } from "react";
import NoData from "../NoData/NoData";
import "./styles.css";

export interface HistogramProps {
  items: HistItem[];
}

export interface HistItem {
  value: number,
  date: string,
}

const commonHeight: number = 250;
const countDivisionsY: number = 10;

const Histogram: React.FC<HistogramProps> = ({ items }) => {
  const [maxItem, setMaxItem] = useState<number>(0);
  const [commonWidth, setCommonWidth] = useState<number>(0);
  const [countDivisionsX, setCountDivisionsX] = useState<number>(0);
  const [divisionsX, setDivisionsX] = useState<string[]>([]);

  const histBodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    calculateDivisionsX();
    setMaxItem(Math.max.apply(null, items.map(item => item.value)));
    window.addEventListener("resize", calculateDivisionsX);

    return () => {
      window.removeEventListener("resize", calculateDivisionsX);
    };
  }, [items]);

  /* Получение массива делений по Y */
  const getDivisionsY = (): number[] => {
    const step = maxItem / countDivisionsY;
    const divisions: number[] = [];
    /* Если все значения не 0, то заполняем массив делений по Y */
    if (step) {
      for (let i = 1; i <= countDivisionsY; i++) {
        divisions.push(+(step * i).toFixed(5));
      }
    }
    return divisions;
  };

  /* Расчитываем количество и значений делений по X */
  const calculateDivisionsX = (): void => {
    if (histBodyRef.current && items.length > 0) {
      const commonWidth = histBodyRef.current.offsetWidth;
      const countDivisionsX = Math.round(commonWidth / 60);

      let startDate = new Date(items[0].date).getTime();
      const endDate = new Date(items[items.length - 1].date).getTime();
      const step = (endDate - startDate) / countDivisionsX;

      const divisions = [];
      while (startDate < endDate) {
        startDate += step;
        divisions.push(new Date(startDate).toLocaleDateString());
      }

      /* Удаляем повторения в массиве*/
      const divisionsUniq = [...new Set(divisions)];
      setCountDivisionsX(divisionsUniq.length);
      setDivisionsX(divisionsUniq);
      setCommonWidth(commonWidth);
    }
  };

  if (items.length === 0) {
    return <NoData title="Empty data" text="Try select another filters" />;
  }

  return (
    <div className="histogram">
      <div className="histogram__divisions">
        {getDivisionsY().map((division, i) =>
          (<span data-testid="division_y" key={i} style={{ bottom: (i + 1) * (commonHeight / countDivisionsY) - 12 }}
                 className="histogram__division_y">{division}</span>))}
      </div>
      <div className="histogram__divisions">
        {divisionsX.map((division, i) => (<span data-testid="division_x" key={i} style={{ left: (i + 1) * (commonWidth / countDivisionsX) - 30 }}
                                                className="histogram__division_x">{division}</span>))}
      </div>
      <div ref={histBodyRef} className="histogram__body">
        {maxItem ? items.map((item, i) => (
          <div data-testid="column" title={`${item.value}`} key={i} className="histogram__column"
               style={{ height: commonHeight * (item.value / maxItem) }} />)) : <React.Fragment />}
      </div>
    </div>
  );
};


export default Histogram;
