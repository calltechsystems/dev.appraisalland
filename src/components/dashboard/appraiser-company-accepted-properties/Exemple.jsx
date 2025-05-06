import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import Loader from "./Loader";
import { FaArchive, FaEye } from "react-icons/fa";
import Image from "next/image";
import { AppraiserStatusOptions } from "../create-listing/data";
// import "./SmartTable.css";

const headCells = [
  {
    id: "order_id",
    numeric: false,
    label: "Property ID",
    width: 110,
  },
  {
    id: "address",
    numeric: false,
    label: "Property Address",
    width: 200,
  },
  {
    id: "status",
    numeric: false,
    label: "Quote Status",
    width: 160,
  },
  {
    id: "appraisal_status",
    numeric: false,
    label: "Appraisal Status",
    width: 160,
  },
  {
    id: "remarkButton",
    numeric: false,
    label: "Appraisal Remark",
    width: 160,
  },
  {
    id: "urgency",
    numeric: false,
    label: "Request Type",
    width: 200,
  },
  {
    id: "date",
    numeric: false,
    label: "Quote Submitted Date",
    width: 200,
  },
  {
    id: "quote_required_by",
    numeric: false,
    label: "Appraisal Report Required By",
    width: 200,
  },
  {
    id: "type_of_building",
    numeric: false,
    label: "Type of Property",
    width: 200,
  },
  {
    id: "estimated_value",
    numeric: false,
    label: "Estimated Value / Purchase Price($)",
    width: 200,
  },
  {
    id: "type_of_appraisal",
    numeric: false,
    label: "Type Of Appraisal",
    width: 200,
  },

  {
    id: "purpose",
    numeric: false,
    label: "Purpose",
    width: 200,
  },

  {
    id: "lender_information",
    numeric: false,
    label: "Lender Information",
    width: 200,
  },

  {
    id: "broker",
    numeric: false,
    label: "Broker Info",
    width: 200,
  },
  {
    id: "property",
    numeric: false,
    label: "Property Info",
    width: 200,
  },
  {
    id: "action",
    numeric: false,
    label: "Action",
    width: 100,
  },
];

let count = 0;

export default function Exemple({
  userData,
  open,
  close,
  start,
  end,
  setUpdatedCode,
  properties,
  setCurrentBid,
  setIsStatusModal,
  setProperties,
  setAllBrokers,
  setRequiredProp,
  onWishlistHandler,
  participateHandler,
  setFilterQuery,
  setSearchInput,
  searchInput,
  filterQuery,
  openModalBroker,
  setErrorMessage,
  setModalIsOpenError,
  onArchivePropertyHandler,
  setRefresh,
  setStartLoading,
  refresh,
  setCurrentBiddedView,
  setOpenQuoteView,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bids, setBids] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  const [show, setShow] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [dataFetched, setDataFetched] = useState(false);
  let tempData = [];
  const [allArchive, setAllArchive] = useState([]);

  useEffect(() => {
    if (searchInput === "") {
      setRefresh(true);
    }
  }, [searchInput]);

  const openRemarkModal = (property) => {
    const isBidded = filterBidsWithin24Hours(property); // Get the isBidded data
    setRemark(isBidded && isBidded.remark ? isBidded.remark : "N.A.");
    setSelectedProperty(property);
    setRemarkModal(true);
  };

  const closeRemarkModal = () => {
    setRemarkModal(false);
    setRemark("N.A.");
    setSelectedProperty(null);
  };

  const openQuoteViewModal = (bid) => {
    setCurrentBiddedView(bid);
    setOpenQuoteView(true);
  };

  const getOrderValue = (val) => {
    let title = "Applicant Contacted by appraiser";
    AppraiserStatusOptions.map((status) => {
      if (String(status.id) === String(val)) {
        title = status.type;
      }
    });
    return title;
  };

  const foundArchiveHandler = (propertyId) => {
    let isArchive = false;
    allArchive?.map((prop, index) => {
      if (prop.propertyId === propertyId) {
        isArchive = true;
      }
    });
    return isArchive;
  };

  const calculateDate = (oldBid, newBid) => {
    if (!oldBid.requestTime) {
      return newBid;
    }

    const oldDate = new Date(oldBid.requestTime);
    const newDate = new Date(newBid.requestTime);

    if (oldDate <= newDate) {
      return newBid;
    }
    return oldBid;
  };

  const getFinalBid = (tempBids) => {
    let finalBid = {};
    tempBids.map((bid, index) => {
      if (!finalBid) {
        finalBid = bid;
      } else {
        if (bid.status === 1) {
          if (finalBid.status === 1) {
            const customBid = calculateDate(finalBid, bid);
            finalBid = customBid;
          } else {
            finalBid = bid;
          }
        } else {
          const customBid = calculateDate(finalBid, bid);
          finalBid = customBid;
        }
      }
    });

    return finalBid;
  };

  const filterBidsWithin24Hours = (property) => {
    const data = JSON.parse(localStorage.getItem("user"));
    let tempBid = 0;
    let bidValue = {};
    let tempBids = [];
    bids.filter((bid) => {
      if (
        bid.orderId === property.orderId &&
        bid.appraiserUserId === data.userId
      ) {
        tempBids.push(bid);
        bidValue = bid;
        tempBid = tempBid + 1;
      } else {
      }
    });
    const customBid = getFinalBid(tempBids);
    return customBid;
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

  const getStatusButtonClass = (orderStatus) => {
    if (orderStatus === 4 || orderStatus === 5) {
      return "btn btn-status-na w-100"; // Orange color class
    }
    return "btn btn-status w-100"; // Default color
  };

  const checkWishlistedHandler = (data) => {
    let temp = {};
    wishlist?.map((prop, index) => {
      if (
        String(prop.propertyId) === String(data.propertyId) &&
        String(prop.userId) === String(userData.userId)
      ) {
        temp = prop;
      }
    });
    return temp ? temp : {};
  };

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.order_id - a.order_id);
  };

  const checkData = properties && !updatedData ? true : false;
  useEffect(() => {
    setProperties([]);
  }, [checkData]);

  useEffect(() => {
    let tempProp = [];
    const getData = () => {
      properties?.map((property, index) => {
        const isWishlist = checkWishlistedHandler(property);
        const isBidded = filterBidsWithin24Hours(property);

        const isArchive = foundArchiveHandler(property.propertyId);

        if (!isArchive && isBidded.status === 1 && isBidded.orderStatus !== 3) {
          tempProp.push(property);
          const isWait = property.isOnHold || property.isOnCancel;
          const updatedRow = {
            order_id: property.orderId,
            address: `${property.city}-${property.province},${property.postalCode}`,
            estimated_value: property.estimatedValue
              ? `$ ${addCommasToNumber(property.estimatedValue)}`
              : "$ 0",
            purpose: property.purpose ? property.purpose : "N.A.",
            appraisal_status:
              isBidded.status === 1 && isBidded.orderStatus === 1 ? (
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
              ) : isBidded.status === 1 && isBidded.orderStatus !== null ? (
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
                  <button
                    className={getStatusButtonClass(isBidded.orderStatus)}
                  >
                    Status
                    <span className="m-1">
                      <i className="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
              ) : (
                <button className="btn btn-warning w-100">
                  <span>N.A.</span>
                </button>
              ),

            // remark: isBidded && isBidded.remark ? isBidded.remark : "N.A.",
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
            order_status: isBidded.orderStatus,
            status: isWait ? (
              <span className="btn btn-danger  w-100">
                {property.isOnHold ? "On Hold" : "Cancelled"}
              </span>
            ) : isBidded.bidId ? (
              isBidded.orderStatus === 3 ? (
                <span className="btn btn-completed  w-100">Completed</span>
              ) : isBidded.status === 0 ? (
                <span className="btn bg-info text-light  w-100">
                  Quote Provided
                </span>
              ) : isBidded.status === 1 ? (
                <span className="btn btn-success  w-100">Accepted</span>
              ) : (
                <span className="btn btn-danger  w-100">Declined</span>
              )
            ) : (
              <span className="btn btn-warning  w-100">New</span>
            ),
            broker: (
              <div>
                {isBidded.status === 1 ? (
                  <a href="#">
                    <button
                      className=""
                      style={{
                        border: "0px",
                        color: "#2e008b",
                        textDecoration: "underline",
                        // fontWeight: "bold",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => openModalBroker(property, 2)}
                    >
                      Broker
                    </button>
                  </a>
                ) : isBidded.status === 2 ? (
                  <h6 style={{ color: "red" }}> Declined</h6>
                ) : (
                  <p className="text-secondary">On quote approval</p>
                )}
              </div>
            ),
            property: (
              <div>
                {isBidded.status === 1 ? (
                  <a href="#">
                    <button
                      className=""
                      style={{
                        border: "0px",
                        color: "#2e008b",
                        textDecoration: "underline",
                        // fontWeight: "bold",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => openModalBroker(property, 1)}
                    >
                      Property
                    </button>
                  </a>
                ) : isBidded.status === 2 ? (
                  <h6 style={{ color: "red" }}> Declined</h6>
                ) : (
                  <p className="text-secondary">On quote approval</p>
                )}
              </div>
            ),
            type_of_appraisal: property.typeOfAppraisal
              ? property.typeOfAppraisal
              : "NA",
            type_of_building:
              property.typeOfBuilding > 0
                ? "Apartment"
                : property.typeOfBuilding,
            quote_required_by: formatDate(property.quoteRequiredDate),
            date: formatDateTime(property.addedDatetime),
            bidAmount: property.bidLowerRange,
            lender_information: property.lenderInformation
              ? property.lenderInformation
              : "N.A.",
            urgency:
              property.urgency === 0
                ? "Rush"
                : property.urgency === 1
                ? "Regular"
                : "N.A.",

            action: (
              <div className="print-hidden-column">
                <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="View Quote"
                >
                  {" "}
                  <span
                    className="btn btn-color-table"
                    onClick={() => openQuoteViewModal(isBidded)}
                  >
                    <Link href={"#"}>
                      <span className="text-light flaticon-view"></span>
                    </Link>
                  </span>
                </li>
              </div>
            ),
          };
          tempData.push(updatedRow);
        }
      });
      setUpdatedData(tempData);
    };
    getData();
    setRequiredProp(tempProp);
  }, [properties, bids, wishlist]);

  useEffect(() => {
    setUpdatedCode(true);
  }, [updatedData]);

  const refreshHandler = () => {
    setRefresh(true);
    setStartLoading(true);
  };
  useEffect(() => {
    setProperties([]);
    setBids([]);
    setWishlist([]);
    setFilterQuery("All");
    setSearchInput("");

    const data = JSON?.parse(localStorage?.getItem("user"));

    let tempProperties = [],
      tempWishlist = [],
      tempBids = [];

    axios
      .get("/api/getAllListedProperties", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.userId,
        },
      })
      .then((res) => {
        const { listedSuccess, data: listedData, listedMessage } = res?.data;
        if (listedSuccess) {
          setDataFetched(true);
          const temp = listedData?.properties?.$values;

          axios
            .get("/api/getAllBids", {
              headers: {
                Authorization: `Bearer ${data?.token}`,
              },
            })
            .then((res) => {
              const { bidSuccess, data: bidData, bidMessage } = res?.data;
              if (bidSuccess) {
                tempBids = bidData?.$values;
                const updatedBids = tempBids?.filter(
                  (prop) =>
                    String(prop?.appraiserUserId) === String(data?.userId)
                );
                setBids(updatedBids);
              }
              axios
                .get("/api/appraiserWishlistedProperties", {
                  headers: {
                    Authorization: `Bearer ${data?.token}`,
                    "Content-Type": "application/json",
                  },
                })
                .then((res) => {
                  const {
                    wishlistSuccess,
                    data: wishlistData,
                    wishlistMessage,
                  } = res?.data;
                  if (wishlistSuccess) {
                    const tempData = res?.data?.data?.$values;
                    const responseData = tempData?.filter(
                      (prop) => String(prop?.userId) === String(data?.userId)
                    );
                    setWishlist(responseData);
                  }
                  setProperties(temp);
                })
                .catch((err) => {
                  toast?.error(err?.response);
                  setErrorMessage(err?.response);
                  setModalIsOpenError(true);
                });
            })
            .catch((err) => {
              setErrorMessage(err?.response?.data?.error);
              setModalIsOpenError(true);
            });
        }
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

    axios
      .get("/api/getAllBids", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      })
      .then((res) => {
        const { bidSuccess, data: bidData, bidMessage } = res?.data;
        if (bidSuccess) {
          tempBids = bidData?.$values;
          const updatedBids = tempBids?.filter(
            (prop) => String(prop?.appraiserUserId) === String(data?.userId)
          );
          setBids(updatedBids);
        }
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

    axios
      .get("/api/getAllBrokers", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      })
      .then((res) => {
        const { brokerSuccess, data: brokerData, brokerMessage } = res?.data;
        if (brokerSuccess) {
          let allbroker = brokerData?.$values || [];
          axios
            .get("/api/getAllBrokerageCompany", {
              headers: {
                Authorization: `Bearer ${data?.token}`,
              },
            })
            .then((res) => {
              const {
                brokerageSuccess,
                data: brokerageData,
                brokerageMessage,
              } = res?.data;
              if (brokerageSuccess) {
                const allbrokerage = brokerageData?.$values || [];
                const updated = [...allbroker, ...allbrokerage];
                setAllBrokers(updated);
              }
            })
            .catch((err) => {
              setErrorMessage(err?.response?.data?.error);
              setModalIsOpenError(true);
            });
        }
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

    axios
      .get("/api/getArchiveAppraiserProperty", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
        params: {
          userId: data?.userId,
        },
      })
      .then((res) => {
        const { archiveSuccess, data: archiveData, archiveMessage } = res?.data;
        if (archiveSuccess) {
          setAllArchive(archiveData?.$values);
        }
      })
      .catch((err) => {
        setDataFetched(false);
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

    setRefresh(false);
  }, [refresh]);
  // console.log(sortObjectsByOrderIdDescending(updatedData));
  return (
    <>
      {refresh ? (
        <Loader />
      ) : (
        <SmartTable
          title=""
          setSearchInput={setSearchInput}
          setFilterQuery={setFilterQuery}
          data={sortObjectsByOrderIdDescending(
            sortObjectsByOrderIdDescending(updatedData)
          )}
          headCells={headCells}
          setRefresh={setRefresh}
          setProperties={setProperties}
          refresh={refresh}
          refreshHandler={refreshHandler}
          setStartLoading={setStartLoading}
          start={start}
          searchInput={searchInput}
          filterQuery={filterQuery}
          dataFetched={dataFetched}
          properties={updatedData}
          end={end}
        />
      )}

      {remarkModal && (
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
      )}
    </>
  );
}
