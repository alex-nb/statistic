import React, { useCallback, useEffect, useState } from "react";
import Histogram, { HistItem } from "../../components/Histogram/Histogram";
import Table, { Sort, TypeSort } from "./Table/Table";
import data from "../../shared/data.json";
import Accordion from "../../components/Accordion/Accordion";
import DateRange, { DateValue } from "../../components/DateRange/DateRange";
import Select from "../../components/Select/Select";
import keys from "../../shared/keys.json";
import "./styles.css";

export interface StatisticData {
  impressions: number;
  clicks: number;
  amount: number;
  leads: number;
  lead_price: number;
  revenue: number;
  net_revenue: number;
  net_potential: number;
  ctr: number;
  ecpm: number;
  ecpa: number;
  day: string;
}

const step = 20;

const MainPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageData, setPageData] = useState<StatisticData[]>(data.slice(0, step));
  const [statisticData, setStatisticData] = useState<StatisticData[]>([...data]);
  const [sort, setSort] = useState<Sort>({});
  const [histogramData, setHistogramData] = useState<HistItem[]>([]);
  const [selectValue, setSelectValue] = useState<keyof StatisticData>();
  const [dateValue, setDateValue] = useState<DateValue>({ monthFrom: "", monthTo: "" });

  useEffect(() => {
    loadDataHistogram();
  }, [selectValue, dateValue]);

  useEffect(() => {
    rebuildDataTable();
  }, [dateValue, sort]);

  const toPage = useCallback((page: number): void => {
    setCurrentPage(page);
    setPageData(statisticData.slice(page * step, page * step + 20));
  }, [setCurrentPage, setPageData]);


  /* Формирование данных для таблицы */
  const rebuildDataTable = () => {
    setCurrentPage(1);
    const { type, column } = sort;
    const { monthTo, monthFrom } = dateValue;

    let sortedData = [...data];

    /* фильтруем данные */
    if (monthFrom && monthTo) {
      sortedData = sortedData
        .filter(item => new Date(item.day).getTime() >= new Date(monthFrom).getTime() && new Date(item.day).getTime() <= new Date(monthTo).getTime());
    }

    /* Сортируем данные */
    if (column) {
      const isAsc = type === TypeSort.ASC;
      if (column === "day") {
        sortedData.sort((a, b) => isAsc && new Date(a[column]) > new Date(b[column]) ? 1 : -1);
      } else {
        sortedData.sort((a, b) => isAsc && Number(a[column]) > Number(b[column]) ? 1 : -1);
      }
    }

    setStatisticData(sortedData);
    setPageData(sortedData.slice(0, step));
  };

  const loadDataHistogram = (): void => {
    if (!selectValue) {
      setHistogramData([]);
      return;
    }

    let filteredData: HistItem[] = data.map(item => ({ value: Number(item[selectValue]), date: item.day }));

    if (dateValue.monthFrom && dateValue.monthTo) {
      filteredData = filteredData
        .filter(item => new Date(item.date).getTime() >= new Date(dateValue.monthFrom).getTime() && new Date(item.date).getTime() <= new Date(dateValue.monthTo).getTime());
    }
    setHistogramData(filteredData.sort((a, b) => new Date(a.date) > new Date(b.date) ? 1 : -1));
  };

  return (
    <div className="main__container">
      <div className="main__content">
        <div className="block">
          <DateRange value={dateValue} onChange={setDateValue} />
        </div>
        <Accordion items={[{
          title: "Chart",
          body: (
            <>
              <div className="block">
                <Select
                  value={selectValue}
                  searchable={true}
                  clearable={true}
                  label={"Choose field for chart metric"}
                  options={keys}
                  onChange={(value) => setSelectValue(value as keyof StatisticData)}
                />
              </div>
              <Histogram items={histogramData} />
            </>
          )
        }]} />
        <Table setSortTable={setSort} data={pageData} currentPage={currentPage}
               lastPage={Math.floor(statisticData.length / step)}
               toPage={toPage} />
      </div>
    </div>
  );
};

export default MainPage;
