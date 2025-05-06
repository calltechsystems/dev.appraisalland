import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SVGArrowDown from "./icons/SVGArrowDown";
import SVGArrowUp from "./icons/SVGArrowUp";
import SVGChevronLeft from "./icons/SVGChevronLeft";
import SVGChevronRight from "./icons/SVGChevronRight";
import { FaRedo } from "react-icons/fa";
import * as XLSX from "xlsx";
import SearchUser from "./SearchUser";
import toast from "react-hot-toast";
import { getTheDownloadView } from "../../common/UserViewPDFDownload";

function SmartTable(props) {
  const [loading, setLoading] = useState(false);
  const [sortDesc, setSortDesc] = useState({});
  const [tableWidth, setTableWidth] = useState(1000);
  const [data, setData] = useState(props.data);

  const componentRef = useRef();

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage ?? 10);
  const [rowsPerPageOptions] = useState(
    props.rowsPerPageOptions ?? [5, 10, 25, 50]
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(props.total ?? 0);

  const fetchData = useCallback(
    async (queryString) => {
      setLoading(true);

      try {
        const response = await fetch(
          props.url + (queryString ? queryString : ""),
          {
            method: "get",
          }
        );
        const data = await response.json();
        if (data && data.data) {
          setData(data.data.result ?? []);
          setTotal(data.data.total, 0);
        }
      } catch (e) {}
      setLoading(false);
    },
    [props.url]
  );

  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    if (props?.dataFetched && props?.properties?.length === 0) {
      const timer = setTimeout(() => {
        setShowNoData(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [props.dataFetched, props.properties]);

  function extractTextFromReactElement(element) {
    if (typeof element === "string") {
      return element;
    } else if (Array.isArray(element)) {
      return element
        .map((child) => extractTextFromReactElement(child))
        .join("");
    } else if (typeof element === "object" && element !== null) {
      return extractTextFromReactElement(element.props.children);
    } else {
      return "";
    }
  }

  const handlePrint = async () => {
    const headers = [
      ["sno", "SNo"],
      ["appraiser_company", "Appraiser Company"],
      // ["plan", "Plan Info"],
      ["currentSubscription", "Plan Name"],
      ["plan", "Transaction History"],
      ["expiryDateOfSubscirption", "Validity"],
      ["bids", "Quote Provided"],
      ["quote_accepted", "Quote Accepted"],
      ["quote_pending", "Quote Pending"],
      ["completed_bids", "Quote Completed"],
      ["status", "Status"],
    ];

    getTheDownloadView(
      "appraiserCompany_Datails",
      props.allProperties,
      "Manage Appraiser Company",
      headers
    )
      .then((message) => {
        toast.success(message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const tableWidthFunc = useCallback(() => {
    let tempTableWidth = 0;
    props.headCells.map((cell) => (tempTableWidth += cell.width));

    if (tempTableWidth) setTableWidth(tempTableWidth);
  }, [props.headCells]);

  useEffect(() => {
    tableWidthFunc();
    if (props.url && !props.data)
      fetchData(`?limit=${props.rowsPerPage ?? 10}`);
  }, [
    props.url,
    props.data,
    props.rowsPerPage,
    props.headCells,
    tableWidthFunc,
    fetchData,
  ]);
  // console.log(props.data);

  const buildQueryString = (search, page, rowsPerPage) => {
    const queries = [];

    if (page) queries.push((page = `${page}`));
    if (rowsPerPage) queries.push(`limit=${rowsPerPage}`);
    if (search) queries.push(`search=${search.toLowerCase()}`);

    const queryString = queries.join("&");

    return queryString ? `?${queryString}` : "";
  };

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const extractTextContent = (cellValue) => {
    if (typeof cellValue === "string") {
      return cellValue; // If it's a string, return it as is
    } else if (typeof cellValue === "object" && cellValue.$$typeof) {
      // If it's a React element, extract text content recursively from children
      return extractTextContent(cellValue.props.children);
    } else {
      return String(cellValue); // Convert other types to string and return
    }
  };

  const extractTextContentFromDate = (value) => {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  };

  const extractNumericValue = (str) => {
    const numericStr = str.replace(/[^0-9]/g, "");
    const numericValue = parseInt(numericStr, 10);

    return numericValue;
  };

  const sortData = (cell) => {
    // Clone props.properties to avoid mutating the original data
    let tempData = [...props.properties];

    // Toggle sorting order for the current cell
    const newSortDesc = { ...sortDesc };
    newSortDesc[cell] = !newSortDesc[cell];

    // Perform sorting
    tempData.sort((a, b) => {
      // Extract text content from cell value (React element or other type)
      let valueA = extractTextContent(a[cell]);
      let valueB = extractTextContent(b[cell]);

      if (String(cell) === "date" || String(cell) === "quote_required_by") {
        valueA = extractTextContentFromDate(a[cell]);
        valueB = extractTextContentFromDate(b[cell]);
      }

      if (String(cell) === "estimated_value") {
        valueA = extractNumericValue(a[cell]);
        valueB = extractNumericValue(b[cell]);
      }

      // Perform comparison based on the sorting order
      if (newSortDesc[cell]) {
        return valueA < valueB ? 1 : -1;
      } else {
        return valueA > valueB ? 1 : -1;
      }
    });

    // Update state with the new sorting order and sorted data
    setSortDesc(newSortDesc);
    setData(tempData);
  };

  return (
    <div className="col-12 p-0">
      <div className="col-lg-12">
        <div className="row">
          <div className="col-lg-7">
            <span className="fw-bold text-dark fs-5">All Brokers</span>
          </div>
          <div className="col-lg-4 text-end_01 mb-1 ">
            <SearchUser
              searchInput={props.searchInput}
              setSearchInput={props.setSearchInput}
            />
          </div>
          <div className="col-lg-1">
            <button
              className="btn btn-color flaticon-download m-1"
              onClick={() => handlePrint()}
              title="Download Pdf"
            ></button>
            <button
              className="btn btn-color"
              onClick={() => props.refreshHandler()}
              title="Refresh"
            >
              <FaRedo />
            </button>
          </div>
        </div>
      </div>
      <div className="smartTable-container row">
        <div className="col-12">
          {props?.data?.length > 0 ? (
            <div className="row mt-3">
              <div className="smartTable-tableContainer" id="table-container">
                <table
                  className={"smartTable-table table table-striped border"}
                  style={{ minWidth: tableWidth }}
                >
                  <thead className="smartTable-thead">
                    <tr>
                      {props?.headCells.map((headCell) => {
                        return (
                          <th
                            id={headCell.id}
                            key={headCell.id}
                            scope="col"
                            style={{
                              width: headCell.width,
                              backgroundColor: "#2e008b",
                              color: "white" ?? "auto",
                            }}
                            className={
                              headCell.sortable !== false
                                ? "smartTable-pointer"
                                : ""
                            }
                            onClick={() =>
                              headCell.sortable !== false &&
                              headCell.id !== "address"
                                ? sortData(headCell.id)
                                : {}
                            }
                          >
                            {headCell.label}
                            {sortDesc[headCell.id] ? (
                              <div></div>
                            ) : // <SVGArrowDown />
                            sortDesc[headCell.id] === undefined ? (
                              ""
                            ) : (
                              <div></div>
                              // <SVGArrowUp />
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0
                      ? data.map((row, idx) => {
                          // if (idx >= props.start && idx <= props.end) {
                          return (
                            <tr key={"tr_" + idx}>
                              {props?.headCells.map((headCell, idxx) => {
                                return (
                                  <td key={"td_" + idx + "_" + idxx}>
                                    {headCell.render
                                      ? headCell.render(row)
                                      : row[headCell.id]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                          // } else {
                          //   return null; // Skip rendering rows that don't meet the condition
                          // }
                        })
                      : props?.data.map((row, idx) => {
                          // if (idx >= props.start && idx <= props.end) {
                          return (
                            <tr key={"tr_" + idx}>
                              {props?.headCells.map((headCell, idxx) => {
                                return (
                                  <td key={"td_" + idx + "_" + idxx}>
                                    {headCell.render
                                      ? headCell.render(row)
                                      : row[headCell.id]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                          // } else {
                          //   return null; // Skip rendering rows that don't meet the condition
                          // }
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="row">
              <div
                className="smartTable-noDataFound col-12"
                style={{ marginTop: "100px", marginBottom: "40px" }}
              >
                {props?.dataFetched && props?.properties?.length === 0 ? (
                  showNoData ? (
                    <h3>No Data Found</h3>
                  ) : (
                    <div className="ring">
                      Loading
                      <span className="load"></span>
                    </div>
                  )
                ) : (
                  <div className="ring">
                    Loading
                    <span className="load"></span>
                  </div>
                )}
              </div>
            </div>
          )}
          {props?.noPagination || data?.length === 0 || !props?.url ? (
            <div className="row">
              <div className="col-12 text-end p-3">
                {props?.data?.length > 0 ? props?.data?.length : 0} Records
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-12 text-end p-3">
                <span>
                  Rows per page:{" "}
                  <select
                    name="rowsPerPage"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(e.target.value);
                      fetchData(buildQueryString(search, page, e.target.value));
                    }}
                  >
                    {rowsPerPageOptions.map((nbr, idx) => {
                      return (
                        <option key={"rowsPerPageOptions_" + idx} value={nbr}>
                          {nbr}
                        </option>
                      );
                    })}
                  </select>
                </span>
                <span className="ms-4">
                  {(page - 1) * rowsPerPage + 1}-
                  {(page - 1) * rowsPerPage + data.length} of {total}
                </span>
                <span
                  className={page === 1 ? "ms-4" : "smartTable-pointer ms-4"}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page === 1) return;
                    setPage(page - 1);
                    fetchData(buildQueryString(search, page - 1, rowsPerPage));
                  }}
                >
                  <SVGChevronLeft
                    color={page === 1 ? "lightgray" : undefined}
                  />
                </span>
                <span
                  className={
                    page * rowsPerPage >= total
                      ? "ms-4"
                      : "smartTable-pointer ms-4"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if ((page - 1) * rowsPerPage > total) return;
                    setPage(page + 1);
                    fetchData(buildQueryString(search, page + 1, rowsPerPage));
                  }}
                >
                  <SVGChevronRight
                    color={
                      page * rowsPerPage >= total ? "lightgray" : undefined
                    }
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

SmartTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.Object),
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  total: PropTypes.number,
  url: PropTypes.string,
  headCells: PropTypes.arrayOf(
    //means Object
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number, //px
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ),
};

export default SmartTable;
