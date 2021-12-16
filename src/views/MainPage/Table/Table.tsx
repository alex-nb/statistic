import React, { useState } from "react";
import { StatisticData } from "../MainPage";
import { IconArrowDropDown } from "../../../components/Svg/Svg";
import keys from "../../../shared/keys.json";
import NoData from "../../../components/NoData/NoData";
import "./styles.css";

export interface TableProps {
  data: StatisticData[];
  lastPage: number;
  currentPage: number;

  toPage(page: number): void;
  setSortTable(sort: Sort): void;
}

export interface Columns {
  value: keyof StatisticData;
  label: string;
}

export enum TypeSort {
  ASC = "asc",
  DESC = "desc",
}

export interface Sort {
  column?: keyof StatisticData;
  type?: TypeSort;
}

const tableColumns = [{ value: "day", label: "Day" }, ...keys] as Columns[];

const Table: React.FC<TableProps> = ({ data, currentPage, lastPage, toPage, setSortTable }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === lastPage;

  const [sort, setSort] = useState<Sort>({});

  /* Получение значений сортировки */
  const getNewSort = (column: keyof StatisticData): Sort => {
    if (!sort.column || sort.column !== column) {
      return { column, type: TypeSort.ASC };
    }
    if (sort.type === TypeSort.ASC) {
      return { column, type: TypeSort.DESC };
    }
    return {};
  };

  const sortTableHandler = (sort: Sort): void => {
    setSort(sort);
    setSortTable(sort);
  };

  const renderPages = (): React.ReactElement => {
    const pages = [];
    /* Заполняем значения страниц, исключая первую, последнюю страницу или страницы, которые мы хотим скрыть */
    for (let i = currentPage - 2; i <= currentPage + 3; i++) {
      if (i > 1 && i < lastPage) {
        pages.push(i);
      }
    }

    return (
      <>
        <span className={isFirstPage ? "_active" : ""} onClick={() => currentPage !== 1 && toPage(1)}>1</span>
        {currentPage > 4 && <span className="_disabled">...</span>}
        {pages.map(page => <span key={page} className={currentPage === page ? "_active" : ""}
                                 onClick={() => currentPage !== page && toPage(page)}>{page}</span>)}
        {lastPage - currentPage > 3 && <span className="_disabled">...</span>}
        {lastPage && lastPage !== 1 ? (<span className={isLastPage ? "_active" : ""}
                                 onClick={() => currentPage !== lastPage && toPage(lastPage)}>{lastPage}</span>) : ""}
      </>
    );
  };

  if (data.length === 0) {
    return <NoData title="Empty data" text="Try select another filters" />
  }

  return (
    <div className="table__container">
      <table className="table">
        <thead>
        <tr data-testid="columns">
          {tableColumns.map((column, i) => (
            <th key={i} className={column.value === sort.column ? `_sort _${sort.type}` : ""} title={column.label}
                onClick={() => sortTableHandler(getNewSort(column.value))}>
              <IconArrowDropDown />
              <span>{column.label}</span>
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {data.map((row, i) => (
          <tr data-testid="row" key={i}>
            <td>{row.day}</td>
            <td>{row.impressions}</td>
            <td>{row.clicks}</td>
            <td>{row.amount}</td>
            <td>{row.leads}</td>
            <td>{row.lead_price}</td>
            <td>{row.revenue}</td>
            <td>{row.net_revenue}</td>
            <td>{row.net_potential}</td>
            <td>{row.ctr}</td>
            <td>{row.ecpm}</td>
            <td>{row.ecpa}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <div data-testid="pages" className="table__pagination">
        <span className={isFirstPage ? "_disabled" : ""}
              onClick={() => !isFirstPage && toPage(1)}>«</span>
        {renderPages()}
        <span className={isLastPage ? "_disabled" : ""}
              onClick={() => !isLastPage && toPage(lastPage)}>»</span>
      </div>
    </div>
  );
};

export default Table;
