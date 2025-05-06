import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios, { all } from "axios";
import { AppraiserStatusOptions } from "../create-listing/data";
import { FaArchive, FaPause, FaPlay } from "react-icons/fa";
import Image from "next/image";
import {
  sortData,
  sortTheDataList,
} from "../../common/PaginationControls/functions";

const headCells = [
  {
    id: "order_id",
    numeric: false,
    label: "Property ID",
    width: 100,
  },
  {
    id: "address",
    numeric: false,
    label: "Property Address",
    width: 270,
    sortable: false,
  },
  {
    id: "status",
    numeric: false,
    label: "Order Status",
    width: 180,
  },
  {
    id: "appraisal_status",
    numeric: false,
    label: "Appraisal Status",
    width: 180,
    sortable: false,
  },
  {
    id: "remarkButton",
    numeric: false,
    label: "Appraisal Remark",
    width: 120,
    sortable: false,
  },
  {
    id: "sub_date",
    numeric: false,
    label: "Quote Submitted Date",
    width: 220,
    sortable: false,
  },
  {
    id: "quote_required_by",
    numeric: false,
    label: "Appraisal Report Required By",
    width: 220,
    sortable: false,
  },
  {
    id: "urgency",
    numeric: false,
    label: "Request Type",
    width: 140,
  },

  {
    id: "type_of_building",
    numeric: false,
    label: "Property Type",
    width: 140,
    sortable: false,
  },
  {
    id: "amount",
    numeric: false,
    label: "Estimated Value / Purchase Price",
    width: 140,
    sortable: false,
  },
  {
    id: "purpose",
    numeric: false,
    label: "Purpose",
    width: 130,
    sortable: false,
  },
  {
    id: "type_of_appraisal",
    numeric: false,
    label: "Type Of Appraisal",
    width: 160,
    sortable: false,
  },
  {
    id: "lender_information",
    numeric: false,
    label: "Lender Information",
    width: 160,
    sortable: false,
  },
  {
    id: "actions_01",
    numeric: false,
    label: "Actions",
    width: 190,
    sortable: false,
  },
];

export default function Exemple({
  userData,
  archievePropertyHandler,
  start,
  end,
  open,
  setModalIsPopupOpen,
  close,
  filterQuery,
  searchInput,
  properties,
  onHoldHandler,
  onCancelHandler,
  refresh,
  setRefresh,
  setProperties,
  setCurrentProperty,
  setFilterQuery,
  setSearchInput,
  setPropertyId,
  setPropValue,
  setModalOpen,
  setHoldModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
  isBidded,
  setfilteredPropertiesCount,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [allBids, setBids] = useState([]);
  const [show, setShow] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [propertiesPerPage, setPropertiesPerPage] = useState([]);

  const [sortDesc, setSortDesc] = useState({});

  let tempData = [];

  useEffect(() => {
    if (refresh === true) {
      setSearchInput("");
      setFilterQuery("All");
    }
  }, [refresh]);

  useEffect(() => {
    if (searchInput === "") {
      setProperties([]);
      setBids([]);
      setRefresh(true);
    }
  }, [searchInput]);


  const getOrderValue = (val) => {
    let title = "";
    AppraiserStatusOptions?.map((status) => {
      if (String(status.id) === String(val)) {
        title = status.type;
      }
    });
    return title;
  };

  const openModal = (propertyId, value, toggle) => {
    if (String(value) === String(1)) {
      setIsHoldProperty(true);
      setPropertyId(propertyId);
      setPropValue(toggle);
    } else {
      setIsCancelProperty(true);
      setPropertyId(propertyId);
      setPropValue(toggle);
    }
    setModalOpen(true);
  };

  const openArchiveModal = (property) => {
    setSelectedProperty(property); // Store the selected property
    setArchiveModal(true);
  };

  const closeArchiveModal = () => {
    setSelectedProperty(null); // Clear the selected property
    setArchiveModal(false); // Close the modal
  };

  const getStatusButtonClass = (orderStatus) => {
    if (orderStatus === 4 || orderStatus === 5) {
      return "btn btn-status-na w-100"; // Orange color class
    }
    return "btn btn-status w-100"; // Default color
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      // hour: "numeric",
      // minute: "numeric",
      // second: "numeric",
      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const getBidOfProperty = (orderId) => {
    let Bid = {};
    allBids.map((bid, index) => {
      if (String(bid.orderId) === String(orderId)) {
        Bid = bid;
      }
    });
    return Bid;
  };

  const openRemarkModal = (property) => {
    const isBidded = getBidOfProperty(property.orderId); // Get the isBidded data
    const isCancel = property.isOnCancel;
    const isHold = property.isOnHold;
    setRemark(
      isCancel || isHold ? "N.A." : isBidded.remark ? isBidded.remark : "N.A."
    );
    setSelectedProperty(property);
    setRemarkModal(true);
  };

  const closeRemarkModal = () => {
    setRemarkModal(false);
    setRemark("N.A.");
    setSelectedProperty(null);
  };

  const refreshHandler = () => {
    setProperties([]);
    setBids([]);
    setRefresh(true);
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getPropertyStatusHandler = (property) => {
    let isInProgress = true;
    let isQuoteProvided = false;
    let isCompleted = false;
    let isAccepted = false;
    allBids.map((bid, index) => {
      if (
        bid.orderId === property.orderId &&
        bid.status === 1 &&
        bid.orderStatus === 3
      ) {
        isCompleted = true;
      }
      if (bid.orderId === property.orderId && bid.status === 1) {
        isAccepted = true;
      } else if (bid.orderId === property.orderId) {
        isQuoteProvided = true;
      }
    });
    return isCompleted ? 3 : isAccepted ? 2 : isQuoteProvided ? 1 : 0;
  };

  const openPopupModal = (property) => {
    setModalIsPopupOpen(true);
    setCurrentProperty(property);
  };
  useEffect(() => {
    const getData = () => {
      const tempData = [];
      properties.map((property, index) => {
        const isBidded = getBidOfProperty(property.orderId);
        const isHold = property.isOnHold;
        const isCancel = property.isOnCancel;
        const isStatus = getPropertyStatusHandler(property);
        const isEditable = isStatus === 0 ? true : false;
        if (isStatus === 3) {
          return; // This will skip adding the completed property to the table
        }
        if (!property.isArchive) {
          const updatedRow = {
            order_id: property.orderId,
            sub_date: formatDateTime(property.addedDatetime),
            quote_required_by: property.quoteRequiredDate
              ? formatDate(property.quoteRequiredDate)
              : formatDate(property.addedDatetime),
            status:
              isHold || isCancel ? (
                <span className="btn bg-danger text-light w-100">
                  {isHold ? "On Hold" : "Cancelled"}
                </span>
              ) : isStatus === 3 ? (
                <span className="btn btn-completed w-100">Completed</span>
              ) : isStatus === 2 ? (
                <span className="btn bg-success w-100 text-light">
                  Accepted
                </span>
              ) : isStatus === 0 ? (
                <span className="btn bg-primary w-100 text-light">
                  In Progress
                </span>
              ) : isStatus === 1 ? (
                <span className="btn bg-info w-100 text-light">
                  Quote Provided
                </span>
              ) : (
                <span className="btn bg-info w-100 text-light">Cancelled</span>
              ),
            appraisal_status:
              isHold || isCancel ? (
                <button className="btn btn-warning w-100">
                  {isHold ? "N.A." : "N.A."}
                </button>
              ) : isBidded.orderStatus !== 1 &&
                isBidded.orderStatus !== null &&
                isBidded.orderStatus !== undefined ? (
                // <span className="btn bg-warning  w-100">
                //   {getOrderValue(isBidded.orderstatus)}
                // </span>
                <div className="hover-text">
                  <div
                    className="tooltip-text"
                    style={{
                      marginTop: "-60px",
                      marginLeft: "-100px",
                    }}
                  >
                    <ul>
                      <li style={{ fontSize: "15px" }}>
                        {getOrderValue(isBidded.orderStatus)}
                      </li>
                    </ul>
                  </div>
                  <span className={getStatusButtonClass(isBidded.orderStatus)}>
                    Status
                    <span className="m-1">
                      <i className="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </span>
                </div>
              ) : isBidded.$id &&
                isBidded.status === 1 &&
                isBidded.orderStatus === 1 &&
                isBidded.orderStatus !== undefined ? (
                <div className="parent-container">
                  <div className="hover-text">
                    <div
                      className="tooltip-text"
                      style={{
                        marginTop: "-60px",
                        marginLeft: "-100px",
                      }}
                    >
                      <ul>
                        <li style={{ fontSize: "15px" }}>
                          {getOrderValue(isBidded.orderStatus)} -{" "}
                          {formatDateTime(isBidded.statusDate)}
                        </li>
                      </ul>
                    </div>
                    <button
                      className={getStatusButtonClass(isBidded.orderStatus)}
                    >
                      Status
                      <span className="m-1">
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-warning w-100">
                  <span>N.A.</span>
                </button>
              ),
            address: `${property.streetNumber} ${property.streetName}, ${property.city}, ${property.province}, ${property.postalCode}`,
            remarkButton: (
              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="View Remark"
              >
                <div
                  className="w-100"
                  onClick={() => openRemarkModal(property)}
                >
                  <button
                    href="#"
                    className="btn btn-color"
                    style={{ width: "120px" }}
                  >
                    <Link href="#">
                      <span className="text-light">
                        {" "}
                        {/* <FaSms/> */}
                        View
                      </span>
                    </Link>
                  </button>
                </div>
              </li>
            ),
            // remark: isCancel
            //   ? "N.A."
            //   : isBidded.remark
            //   ? isBidded.remark
            //   : "N.A.",
            type_of_building: property.typeOfBuilding,
            // amount: ` $ ${millify(property.estimatedValue)}`,
            amount: `$ ${addCommasToNumber(property.estimatedValue)}`,
            purpose: property.purpose,
            type_of_appraisal: property.typeOfAppraisal,
            lender_information: property.lenderInformation
              ? property.lenderInformation
              : "N.A.",
            urgency: property.urgency === 0 ? "Rush" : "Regular",
            actions_01: (
              <ul className="mb0 d-flex justify-content-center gap-1">
                <li title="Property Details" className="">
                  <span
                    className="btn btn-color-table"
                    onClick={() => openPopupModal(property)}
                  >
                    <Link href={"#"}>
                      <span className="text-light flaticon-view"></span>
                    </Link>
                  </span>
                </li>
                {/* )} */}

                {!isEditable && !isCancel && (
                  <li title="Quotes">
                    {isHold ? (
                      <button
                        className="btn btn-color-table"
                        onClick={() => setHoldModalOpen(true)} // Assuming setModalOpen manages modal state
                      >
                        <span className="flaticon-invoice"></span>
                      </button>
                    ) : (
                      <Link
                        className="btn btn-color-table"
                        href={`/my-property-bids/${property.orderId}`}
                      >
                        <span className="flaticon-invoice"></span>
                      </Link>
                    )}
                  </li>

                )}

                {(isEditable || isStatus === 1) && !isCancel && (
                  <li title="Edit Property">
                    <Link
                      className="btn btn-color-table"
                      href={`/create-listing/${property.orderId}`}
                    >
                      <span className="flaticon-edit"></span>
                    </Link>
                  </li>
                )}

                {/* End li */}
                {!isCancel && isStatus !== 3 && isBidded.orderStatus !== 4 && (
                  <li title={!isHold ? "On Hold" : "Remove Hold"}>
                    <button
                      className="btn btn-color-table"
                      style={{ border: "1px solid grey" }}
                      onClick={() =>
                        openModal(property.orderId, 1, isHold ? 0 : property)
                      }
                      title={
                        isHold ? "Remove On Hold Property" : "On Hold Property"
                      }
                    >
                      {isHold ? (
                        <FaPlay className="text-light" />
                      ) : (
                        <FaPause className="text-light" />
                      )}
                    </button>
                  </li>
                )}

                {!isCancel && isStatus !== 3 && !isHold && (
                  <li title={"Order Cancel"}>
                    <span
                      className="btn btn-color-table"
                      style={{ border: "1px solid grey" }}
                      onClick={() => openModal(property.orderId, 2, property)}
                    >
                      <Link href="#">
                        <span className="text-light">
                          <i className="fa fa-times"></i>
                        </span>
                      </Link>
                    </span>
                  </li>
                )}

                <li title="Archive Property">
                  <span
                    className="btn btn-color-table"
                    // onClick={() => archievePropertyHandler(property.orderId)}
                    onClick={() => openArchiveModal(property)}
                  >
                    <Link className="color-light" href="#">
                      <span className="text-light">
                        <FaArchive />
                      </span>
                    </Link>
                  </span>
                </li>

                {/* End li */}
              </ul>
            ),
          };
          tempData.push(updatedRow);
        }
      });
      setfilteredPropertiesCount(tempData?.length);
      const filteredData = sortTheDataList(tempData, sortDesc);
      setUpdatedData(filteredData);
    };
    getData();
  }, [properties, sortDesc]);

  useEffect(() => {
    setPropertiesPerPage(updatedData.slice(start, end));
  }, [start, end, updatedData]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    axios
      .get("/api/getAllListedProperties2", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.userId,
        },
      })
      .then((res) => {
        toast.dismiss();
        setDataFetched(true);
        const {
          success: listedSuccess,
          data: listedData,
          message: listedMessage,
        } = res?.data;
        if (listedSuccess) {
          const temp = listedData?.properties?.$values;
          let tempProperties = [];
          tempProperties = temp?.filter((prop, index) => {
            if (String(prop?.userId) === String(data.userId)) {
              return true;
            } else {
              return false;
            }
          });
          axios
            .get("/api/getAllBids", {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            })
            .then((res) => {
              const {
                success: bidSuccess,
                data: bidData,
                message: bidMessage,
              } = res?.data;
              if (bidSuccess) {
                tempBids = bidData.$values;
                setProperties(tempProperties);
                setBids(tempBids);
              }
            })
            .catch((err) => {
              toast.error(err);
              setDataFetched(false);
              // setModalIsOpenError(true);
            });
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });
    setSearchInput("");
    setFilterQuery("All");
    setProperties([]);
    setBids([]);

    let tempBids = [];

    setRefresh(false);
  }, [refresh]);
  return (
    <>
      {updatedData && (
        <SmartTable
          title=""
          searchInput={searchInput}
          setFilterQuery={setFilterQuery}
          setSearchInput={setSearchInput}
          data={propertiesPerPage}
          headCells={headCells}
          filterQuery={filterQuery}
          refreshHandler={refreshHandler}
          start={start}
          dataFetched={dataFetched}
          properties={propertiesPerPage}
          allProperties={updatedData}
          end={end}
          setUpdatedData={setUpdatedData}
          sortDesc={sortDesc}
          setSortDesc={setSortDesc}
          sortData={sortData}
        />
      )}

      {archiveModal ? (
        <div className="modal">
          <div className="modal-content" style={{ width: "30%" }}>
            <div className="row">
              <div className="col-lg-12">
                <Link href="/" className="">
                  <Image
                    width={50}
                    height={45}
                    className="logo1 img-fluid"
                    style={{ marginTop: "-20px" }}
                    src="/assets/images/logo.png"
                    alt="header-logo2.png"
                  />
                  <span
                    style={{
                      color: "#2e008b",
                      fontWeight: "bold",
                      fontSize: "24px",
                      // marginTop: "20px",
                    }}
                  >
                    Appraisal
                  </span>
                  <span
                    style={{
                      color: "#97d700",
                      fontWeight: "bold",
                      fontSize: "24px",
                      // marginTop: "20px",
                    }}
                  >
                    {" "}
                    Land
                  </span>
                </Link>
              </div>
            </div>
            <h3 className="text-center mt-3" style={{ color: "#2e008b" }}>
              Order Confirmation– Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              Are you sure for the order to be{" "}
              <span className="text-danger fw-bold">Archived</span> ?
            </p>
            <div
              className="mb-3 mt-4"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div className="col-lg-12 d-flex justify-content-center gap-2">
              <button
                // disabled={disable}
                className="btn btn-color w-25"
                onClick={closeArchiveModal}
              >
                Cancel
              </button>
              <button
                // disabled={disable}
                className="btn btn-color w-25"
                onClick={() => {
                  archievePropertyHandler(selectedProperty?.orderId);
                  setArchiveModal(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {remarkModal ? (
        <div className="modal">
          <div className="modal-content" style={{ width: "35%" }}>
            <div className="row">
              <div className="col-lg-12">
                <Link href="/" className="">
                  <Image
                    width={50}
                    height={45}
                    className="logo1 img-fluid"
                    style={{ marginTop: "-20px" }}
                    src="/assets/images/logo.png"
                    alt="header-logo2.png"
                  />
                  <span
                    style={{
                      color: "#2e008b",
                      fontWeight: "bold",
                      fontSize: "24px",
                      // marginTop: "20px",
                    }}
                  >
                    Appraisal
                  </span>
                  <span
                    style={{
                      color: "#97d700",
                      fontWeight: "bold",
                      fontSize: "24px",
                      // marginTop: "20px",
                    }}
                  >
                    {" "}
                    Land
                  </span>
                </Link>
              </div>
            </div>
            <h3 className="text-center mt-3" style={{ color: "#2e008b" }}>
              Appraiser Remarks - Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <div className="text-center">
              <span className="fs-5 text-dark mt-4 remark-text">{remark}</span>
            </div>
            <div
              className="mb-3 mt-4"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div className="col-lg-12 d-flex justify-content-center gap-2">
              <button
                // disabled={disable}
                className="btn btn-color w-25"
                onClick={closeRemarkModal}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
