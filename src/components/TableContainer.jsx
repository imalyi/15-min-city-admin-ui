import React, { Fragment } from "react";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
//import { Table, Row, Col, Button, Input } from 'reactstrap';
import "./style/Categories.css";
import { Filter, DefaultColumnFilter } from "./Filters";
import { useTranslation } from "react-i18next";

function TableContainer({ columns, data }) {
  const { t } = useTranslation();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    //    pageOptions,
    //    pageCount,
    //    state: { pageIndex, pageSize },
    //    gotoPage,
    //    previousPage,
    //    nextPage,
    //    canPreviousPage,
    //    canNextPage,
    //    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        defaultColumn: { Filter: DefaultColumnFilter },
      },
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  const runTask = async (taskApiLink) => {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    // Sprawdź, czy token istnieje
    if (!userToken) {
      console.error("Brak tokenu użytkownika.");
      return;
    }
    try {
      console.log(taskApiLink);
      const response = await fetch(`${taskApiLink}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Dodaj token do nagłówka Authorization
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        console.log("Pomyślnie uruchomiono zadanie.");
        // Tutaj możesz obsłużyć dodatkowe kroki po pomyślnym uruchomieniu zadania
      } else {
        console.error("Błąd podczas uruchamiania zadania.");
      }
    } catch (error) {
      console.error("Błąd podczas komunikacji z serwerem", error);
    }
  };

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  /*  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value))
  }
  
  const onChangeInInput = event => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    gotoPage(page)
  }
*/
  const handleActionClick = (action, taskApiLink) => {
    if (action === "run") {
      runTask(taskApiLink);
    }
  };

  return (
    <Fragment>
      <Table
        bordered
        hover
        {...getTableProps()}
        className="border-max"
        id="tasks"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <div {...column.getSortByToggleProps()}>
                    {column.render("Header")}
                    {generateSortingIndicator(column)}
                  </div>
                  <Filter column={column} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={row.index % 2 === 0 ? "even" : ""}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.column.id === "place.value" ? (
                        <Link to={`/fullstats/${row.original.id}`}>
                          {cell.render("Cell")}
                        </Link>
                      ) : cell.column.id === "startNow" ? (
                        <div>
                          <button
                            className="table-button"
                            onClick={() =>
                              handleActionClick("run", row.values.startNow)
                            }
                          >
                            {t("Start Now")}
                          </button>
                        </div>
                      ) : cell.column.id === "schedule" ? (
                        <div>{row.values.schedule}</div>
                      ) : cell.column.id === "schedulelist" ? (
                        <div>{row.values.every}</div>
                      ) : (
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {/*
    <Row style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
    <Col md={3}>
      <Button
        color="primary"
        onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
      >
        {"<<"}
      </Button>
      <Button
        color="primary"
        onClick={previousPage}
        disabled={!canPreviousPage}
      >
        {"<"}
      </Button>
    </Col>
    <Col md={2} style={{ marginTop: 7 }}>
      Page{" "}
      <strong>
        {pageIndex + 1} of {pageOptions.length}
      </strong>
    </Col>
    <Col md={2}>
      <Input
        type="number"
        min={1}
        style={{ width: 70 }}
        max={pageOptions.length}
        defaultValue={pageIndex + 1}
        onChange={onChangeInInput}
      />
    </Col>
    <Col md={2}>
      <Input type="select" value={pageSize} onChange={onChangeInSelect}>
        {[3, 10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </Input>
    </Col>
    <Col md={3}>
      <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
        {">"}
      </Button>
      <Button
        color="primary"
        onClick={() => gotoPage(pageCount - 1)}
        disabled={!canNextPage}
      >
        {">>"}
      </Button>
    </Col>
  </Row>
        */}
    </Fragment>
  );
}

export default TableContainer;
