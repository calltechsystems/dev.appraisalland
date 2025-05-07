import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import SVGChevronLeft from "./icons/SVGChevronLeft";
import SVGChevronRight from "./icons/SVGChevronRight";
import { FaArrowDown, FaArrowUp, FaDownload, FaRedo } from "react-icons/fa";
import toast from "react-hot-toast";
import SearchBox from "./SearchBox";
import Filtering from "./Filtering";
import LoadingSpinner from "../../common/LoadingSpinner";
import NoDataFound from "../../common/NoDataFound";
import { getTheDownloadView } from "../../common/UserViewPDFDownload";
import RecordCount from "../../common/PaginationControls/RecordCounts";
import SmartTableHeaderCell from "../../common/PaginationControls/SmartTableHeaderCell";

function SmartTable(props) {
  const [loading, setLoading] = useState(false);
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
  const [changes, setChanges] = useState(false);

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
      } catch (e) {
        // console.log("Fetch error", e.message);
      }
      setLoading(false);
    },
    [props.url]
  );

  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    if (props.dataFetched && props.properties.length === 0) {
      const timer = setTimeout(() => {
        setShowNoData(true);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [props.dataFetched, props.properties]);

  //this function to download the function
  const handlePrint = async () => {
    const headers = [
      ["order_id", "Property ID"],
      ["address", "Property Address"],
      ["assigned_appraiser", "Assigned Appraiser"],
      ["status", "Quote Status"],
      ["appraisal_status", "Appraisal Status"],
      ["remark", "Appraisal Remark"],
      ["urgency", "Request Type"],
      ["date", "Order Submission Date"],
      ["quote_required_by", "Appraisal Report Required By"],
      ["type_of_building", "Type Of Property"],
      ["estimated_value", "Estimated Property Value ($)"],
      ["type_of_appraisal", "Type Of Appraisal"],
      ["purpose", "Purpose"],
      ["lender_information", "Lender Information"],
    ];

    getTheDownloadView(
      "appraiserCompanyDetail",
      props.allProperties,
      "Appraiser Company Properties",
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
    props.headCells?.map((cell) => (tempTableWidth += cell.width));

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

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  return (
    <div className="col-12 pt-4">
      <div className="smartTable-container row">
        <div className="candidate_revew_select style2 mb30-991">
          <ul className="mb0">
            <li className="list-inline-item">
              <Filtering
                filterQuery={props.filterQuery}
                setFilterQuery={props.setFilterQuery}
              />
            </li>
            <li className="list-inline-item" style={{ marginRight: "15px" }}>
              <div className="candidate_revew_search_box course fn-520">
                <SearchBox
                  searchInput={props.searchInput}
                  setSearchInput={props.setSearchInput}
                />
              </div>
            </li>
            <li className="list-inline-item">
              {loading && (
                <div className="smartTable-loaderContainer text-primary">
                  <div className="spinner-border" role="status"></div>
                </div>
              )}
              <div className="col-lg-12">
                <div className="row">
                  <div className="d-flex gap-1">
                    <div className="tooltip-container">
                      <span className="tooltip-text">
                        **Landscape** is the preferrable type for downloading as
                        a pdf
                      </span>
                      <button
                        className="btn btn-color"
                        onClick={() => handlePrint()}
                      >
                        <FaDownload />
                      </button>
                    </div>
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
            </li>
          </ul>
        </div>
        <div className="col-12">
          {props.data.length > 0 ? (
            <div className="row">
              <div
                className="smartTable-tableContainer"
                id="table-container"
                style={{
                  overflow: "auto",
                  position: "relative",
                  maxHeight: "500px",
                }}
              >
                <table
                  className={"smartTable-table table table-striped border"}
                  style={{ minWidth: tableWidth }}
                >
                  <thead className="smartTable-thead">
                    <tr>
                      {props.headCells.map((headCell, index) => {
                        return (
                          <SmartTableHeaderCell
                            key={headCell.id}
                            headCell={headCell}
                            index={index}
                            sortDesc={props.sortDesc}
                            sortData={(cell) =>
                              props.sortData(
                                cell,
                                props.sortDesc,
                                props.setSortDesc
                              )
                            }
                          />
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0
                      ? data.map((row, idx) => {
                          return (
                            <tr key={"tr_" + idx}>
                              {props.headCells.map((headCell, idxx) => {
                                return (
                                  <td
                                    key={"td_" + idx + "_" + idxx}
                                    className={idxx === 0 ? "sticky-cell" : ""}
                                    style={{
                                      position:
                                        idxx === 0 ? "sticky" : "static",
                                      left: idxx === 0 ? "0" : undefined,
                                      backgroundColor:
                                        idxx === 0 ? "gray" : undefined,
                                      color: idxx === 0 ? "white" : undefined,
                                      zIndex: idxx === 0 ? "2" : "1",
                                    }}
                                  >
                                    {headCell.render
                                      ? headCell.render(row)
                                      : row[headCell.id]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })
                      : null}
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
                {props.dataFetched && props.properties.length === 0 ? (
                  showNoData ? (
                    <NoDataFound />
                  ) : (
                    <LoadingSpinner />
                  )
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            </div>
          )}
          {props.noPagination || data.length === 0 || !props.url ? (
            <div className="row">
              <RecordCount
                start={props.start}
                end={props.end}
                allProperties={props.allProperties}
                totalCount={props.allProperties?.length}
              />
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
  data: PropTypes.arrayOf(PropTypes.object),
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
