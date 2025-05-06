import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import Loader from "./Loader";
import { FaArchive, FaEye } from "react-icons/fa";
import { AppraiserStatusOptions } from "../create-listing/data";
import millify from "millify";
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
    width: 110,
  },
  {
    id: "address",
    numeric: false,
    label: "Property Address",
    width: 200,
    sortable: false,
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
    sortable: false,
  },
  {
    id: "remarkButton",
    numeric: false,
    label: "Appraisal Remark",
    width: 160,
    sortable: false,
  },
  {
    id: "urgency",
    numeric: false,
    label: "Request Type",
    width: 150,
  },
  {
    id: "date",
    numeric: false,
    label: "Order Submission Date",
    width: 200,
    sortable: false,
  },
  {
    id: "quote_required_by",
    numeric: false,
    label: "Appraisal Report Required By",
    width: 200,
    sortable: false,
  },
  {
    id: "type_of_building",
    numeric: false,
    label: "Type of Property",
    width: 200,
    sortable: false,
  },
  {
    id: "estimated_value",
    numeric: false,
    label: "Estimated Value / Purchase Price($)",
    width: 200,
    sortable: false,
  },
  {
    id: "type_of_appraisal",
    numeric: false,
    label: "Type Of Appraisal",
    width: 200,
    sortable: false,
  },

  {
    id: "purpose",
    numeric: false,
    label: "Purpose",
    width: 200,
    sortable: false,
  },

  {
    id: "lender_information",
    numeric: false,
    label: "Lender Information",
    width: 200,
    sortable: false,
  },

  {
    id: "broker",
    numeric: false,
    label: "Broker Info",
    width: 200,
    sortable: false,
  },
  {
    id: "property",
    numeric: false,
    label: "Property Info",
    width: 200,
    sortable: false,
  },

  {
    id: "action",
    numeric: false,
    label: "Action",
    width: 210,
    sortable: false,
  },
];

let count = 0;

export default function Exemple({
  userData,
  open,
  close,
  start,
  end,
  setCurrentBiddedView,
  setUpdatedCode,
  properties,
  setCurrentBid,
  setAllAppraiser,
  setAssignPropertyId,
  setOpenQuoteView,
  setAssignModal,
  setIsStatusModal,
  setProperties,
  setAllBrokers,
  onWishlistHandler,
  participateHandler,
  setFilterQuery,
  setSearchInput,
  openModalBroker,
  searchInput,
  filterQuery,
  setErrorMessage,
  setModalIsOpenError,
  onArchivePropertyHandler,
  setRefresh,
  setStartLoading,
  refresh,
  setSelectedPropertyNew,
  setIsLoading,
  setfilteredPropertiesCount,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bids, setBids] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  const [show, setShow] = useState(false);
  const [archivedProperties, setArchivedProperties] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [statusData, setStatusData] = useState([]);
  let tempData = [];
  const [allArchive, setAllArchive] = useState([]);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [wishlistModal, setWishlistModal] = useState(false);
  const [isWishlistProperty, setIsWishlistProperty] = useState(0);
  const [selectedWishlistId, setSelectedWishlistId] = useState(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const [propertiesPerPage, setPropertiesPerPage] = useState([]);
  const [sortDesc, setSortDesc] = useState({});

  useEffect(() => {
    if (searchInput === "") {
      setRefresh(true);
    }
  }, [searchInput]);

  const getOrderValue = (val) => {
    let title = "Applicant Contacted by appraiser";
    AppraiserStatusOptions?.map((status) => {
      if (String(status?.id) === String(val)) {
        title = status?.type;
      }
    });
    return title;
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
    tempBids?.map((bid, index) => {
      if (!finalBid) {
        finalBid = bid;
      } else {
        if (bid?.status === 1) {
          if (finalBid?.status === 1) {
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

  const getisAlreadyArchived = (propertyId) => {
    let isPresent = false;
    archivedProperties?.map((prop, index) => {
      if (String(prop?.propertyId) === String(propertyId)) {
        isPresent = true;
      }
    });
    return isPresent;
  };

  const filterBidsWithin24Hours = (property) => {
    const data = JSON.parse(localStorage.getItem("user"));
    let tempBid = 0;
    let bidValue = {};
    let tempBids = [];
    bids.filter((bid) => {
      if (
        bid?.orderId === property?.orderId &&
        bid?.appraiserUserId === data?.userId
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

  const alreadyAccepted = (property) => {
    const data = JSON.parse(localStorage.getItem("user"));
    let isAccepted = {};
    bids?.filter((bid) => {
      if (
        String(bid?.orderId) === String(property?.orderId) &&
        String(bid?.appraiserUserId) !== String(data?.userId)
      ) {
        if (bid?.status === 1) {
          isAccepted = bid;
        }
      }
    });
    return isAccepted?.bidId ? true : false;
  };
  const router = useRouter();

  const openArchiveModal = (property) => {
    setSelectedProperty(property); // Store the selected property
    setArchiveModal(true);
  };

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

  const closeArchiveModal = () => {
    setSelectedProperty(null); // Clear the selected property
    setArchiveModal(false); // Close the modal
    setWishlistModal(false); // Close the modal
    setIsWishlistProperty(false);
  };

  const openWishlistModal = (property) => {
    setSelectedProperty(property); // Store the selected property
    setWishlistModal(true);
  };

  const openIsWishlistPropertyModal = (wishlistId, property) => {
    setSelectedWishlistId(wishlistId);
    setSelectedProperty(property);
    setIsWishlistProperty(true);
  };

  const handleConfirmRemoveWishlist = () => {
    if (selectedWishlistId) {
      // Call your removeWishlistHandler or similar logic here
      removeWishlistHandler(selectedWishlistId);
    }
    setIsWishlistProperty(false);
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const openStatusUpdateHandler = (bid, property) => {
    setCurrentBid(bid);
    setSelectedPropertyNew(property);
    setIsStatusModal(true);
  };

  const removeWishlistHandler = (id) => {
    const userData = JSON.parse(localStorage.getItem("user") || {});

    const formData = {
      userId: userData.userId,
      propertyId: id,
      token: userData.token,
    };

    const payload = encryptionData(formData);
    setIsLoading(true);
    toast.loading("removing this property into your wishlist");
    axios
      .delete("/api/removeWishlistProperty", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        params: {
          wishlistId: id,
        },
      })
      .then((res) => {
        toast.dismiss();
        const {
          success: wishlistSuccess,
          data: wishlistData,
          message: wishlistMessage,
        } = res?.data;
        if (wishlistSuccess) {
          setIsLoading(false);
          toast.success("Successfully removed !!! ");
          location.reload(true);
        } else {
          toast.error(
            wishlistMessage ?? "An error occurred while updating the record."
          );
        }
      })
      .catch((err) => {
        toast.dismiss();
        setIsLoading(false);
        toast.error(err?.response?.data?.error);
      });
  };

  const openQuoteViewModal = (bid) => {
    setCurrentBiddedView(bid);
    setOpenQuoteView(true);
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

  const getStatusButtonClass = (orderStatus) => {
    if (orderStatus === 4 || orderStatus === 5) {
      return "btn btn-status-na w-100"; // Orange color class
    }
    return "btn btn-status w-100"; // Default color
  };

  const checkWishlistedHandler = (data) => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    let temp = {};
    wishlist?.map((prop, index) => {
      if (
        String(prop?.propertyId) === String(data?.propertyId) &&
        String(prop?.userId) === String(userInfo?.userId)
      ) {
        temp = prop;
      }
    });
    return temp ? temp : {};
  };

  const checkData = properties && !updatedData ? true : false;
  useEffect(() => {
    setProperties([]);
  }, [checkData]);

  useEffect(() => {
    let tempStatusData = [];
    const getData = () => {
      const userData = JSON.parse(localStorage.getItem("user") || {});
      let tempData = [];
      properties?.map((property, index) => {
        const isWishlist = checkWishlistedHandler(property);
        const isBidded = filterBidsWithin24Hours(property);
        const anotherBid = alreadyAccepted(property);
        const isAlreadyArchived = getisAlreadyArchived(property.propertyId);
        const haveSubscription = userData?.planLimitExceed;

        const isWait = property?.isOnHold || property?.isOnCancel;
        const isArchive = false;

        // Skip Completed Orders
        if (isBidded.orderStatus === 3) return;

        if (!isAlreadyArchived) {
          if (isBidded.status === 1) {
            // console.log(getOrderValue(isBidded.orderStatus));
          }

          const newStatus = {
            status: isBidded?.status,
            appraisal_status: isBidded?.orderStatus,
            order_id: property?.orderId,
          };
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
                  <span className={getStatusButtonClass(isBidded.orderStatus)}>
                    Status
                    <span className="m-1">
                      <i className="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </span>
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
            status:
              anotherBid === true && isBidded.status !== 2 ? (
                <span className="btn btn-danger  w-100">Declined</span>
              ) : isBidded?.bidId && isBidded.status === 2 ? (
                <span className="btn btn-danger  w-100">Declined</span>
              ) : isWait ? (
                <span className="btn btn-danger  w-100">
                  {property.isOnCancel
                    ? "Cancelled"
                    : property.isOnHold
                    ? "On Hold"
                    : ""}
                </span>
              ) : isBidded.bidId ? (
                isBidded.orderStatus === 3 ? (
                  <span className="btn btn-completed w-100">Completed</span>
                ) : isBidded.status === 0 ? (
                  <span className="btn bg-info text-light w-100">
                    Quote Provided
                  </span>
                ) : isBidded.status === 1 ? (
                  <span className="btn btn-success  w-100">Accepted</span>
                ) : (
                  ""
                )
              ) : (
                <span className="btn btn-warning  w-100">New</span>
              ),
            broker: (
              <div>
                {isBidded.status === 1 ? (
                  <a href="#">
                    <button
                      className="list-inline-item"
                      style={{
                        border: "0px",
                        color: "#2e008b",
                        textDecoration: "underline",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => openModalBroker(property, 2)}
                    >
                      Broker Info
                    </button>
                  </a>
                ) : isBidded.status === 2 ||
                  anotherBid?.bidId ||
                  (anotherBid === true && isBidded.status !== 2) ? (
                  <h6 style={{ color: "red" }}> Declined</h6>
                ) : alreadyAccepted ? (
                  <span className="text-secondary">On quote approval</span>
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
                      className="list-inline-item"
                      style={{
                        border: "0px",
                        color: "#2e008b",
                        textDecoration: "underline",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => openModalBroker(property, 1)}
                    >
                      Property Info
                    </button>
                  </a>
                ) : isBidded.status === 2 ||
                  anotherBid?.bidId ||
                  (anotherBid === true && isBidded.status !== 2) ? (
                  <h6 style={{ color: "red" }}> Declined</h6>
                ) : alreadyAccepted ? (
                  <span className="text-secondary">On quote approval</span>
                ) : (
                  <p className="text-secondary ">On quote approval</p>
                )}
              </div>
            ),
            type_of_appraisal: property.typeOfAppraisal
              ? property.typeOfAppraisal
              : "N.A.",
            type_of_building:
              property.typeOfBuilding > 0
                ? "Apartment"
                : property.typeOfBuilding,
            quote_required_by: formatDate(property.quoteRequiredDate),
            date: formatDateTime(property.addedDatetime),
            bidAmount: millify(property.bidLowerRange),
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
              <div
                className="print-hidden-column"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {isBidded.$id &&
                  (isBidded.status === 2 || isBidded.status === 1) &&
                  !anotherBid?.bidId && (
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
                  )}

                {isBidded.status === 2 || anotherBid.bidId ? (
                  <>
                    <ul>
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Archive Property"
                      >
                        <div
                          className="w-100"
                          onClick={() => openArchiveModal(property)}
                          // onClick={() =>
                          //   onArchivePropertyHandler(property.orderId)
                          // }
                        >
                          <button href="#" className="btn btn-color">
                            <Link href="#">
                              <span className="text-light">
                                {" "}
                                <FaArchive />
                              </span>
                            </Link>
                          </button>
                        </div>
                      </li>
                    </ul>
                  </>
                ) : isWait ? (
                  <>
                    {/* <p className="btn btn-danger  w-100">
                      {`No further actions can be taken on this property since it is ${
                        property.isoncancel ? "Cancelled" : "On Hold"
                      } .`}
                    </p> */}
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Archive Property"
                    >
                      <div
                        className="w-100"
                        onClick={() => openArchiveModal(property)}
                      >
                        <button href="#" className="btn btn-color ">
                          <Link href="#">
                            <span className="text-light">
                              {" "}
                              <FaArchive />
                            </span>
                          </Link>
                        </button>
                      </div>
                    </li>
                  </>
                ) : isBidded.$id && isBidded.orderStatus === 3 ? (
                  <>
                    {/* <p className="btn btn-success  w-100">Completed </p> */}
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Archive Property"
                    >
                      <div
                        className="w-100"
                        onClick={() => openArchiveModal(property)}
                      >
                        <button href="#" className="btn btn-color ">
                          <Link href="#">
                            <span className="text-light">
                              {" "}
                              <FaArchive />
                            </span>
                          </Link>
                        </button>
                      </div>
                    </li>
                  </>
                ) : (
                  <ul className="mb0 d-flex gap-1">
                    {isWishlist.id ? (
                      <button
                        className="btn "
                        style={{ border: "1px solid grey" }}
                        // onClick={() => removeWishlistHandler(isWishlist.id)}
                        onClick={() =>
                          openIsWishlistPropertyModal(isWishlist.id, property)
                        }
                        title="Remove Wishlist Property"
                      >
                        <img
                          width={26}
                          height={26}
                          src="https://png.pngtree.com/png-clipart/20200226/original/pngtree-3d-red-heart-cute-valentine-romantic-glossy-shine-heart-shape-png-image_5315044.jpg"
                        />
                      </button>
                    ) : (
                      !anotherBid && (
                        <li
                          className="list-inline-item"
                          title="Wishlist Property"
                        >
                          {
                            <button
                              className="btn"
                              style={{ border: "1px solid grey" }}
                              onClick={() => openWishlistModal(property)}
                            >
                              <span className="flaticon-heart text-color"></span>
                            </button>
                          }
                        </li>
                      )
                    )}

                    {(!isBidded.$id || isBidded?.status < 1) && !anotherBid && (
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={`${
                          isBidded.$id ? "View / Update Quote" : "Provide Quote"
                        }`}
                      >
                        <div className="w-100">
                          <button
                            className="btn btn-color"
                            onClick={() => {
                              haveSubscription === 1
                                ? setIsLimitModalOpen(true) // Open modal if no subscription
                                : participateHandler(
                                    property?.bidLowerRange,
                                    property?.orderId,
                                    isBidded?.status < 1,
                                    isBidded?.bidAmount,
                                    isBidded?.$id ? true : false
                                  );
                            }}
                          >
                            <Link href="#">
                              <span className="flaticon-invoice text-light"></span>
                            </Link>
                          </button>
                        </div>
                      </li>
                    )}

                    {isBidded.status === 1 && isBidded.orderStatus !== 3 ? (
                      <>
                        <ul>
                          <li
                            className="list-inline-item"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Status Update"
                          >
                            <button
                              href="#"
                              className="btn btn-color"
                              onClick={() =>
                                openStatusUpdateHandler(isBidded, property)
                              }
                            >
                              <Link href="#">
                                <span className="flaticon-edit text-light"></span>
                              </Link>
                            </button>
                          </li>
                        </ul>
                      </>
                    ) : (
                      ""
                    )}

                    {isWishlist?.id ? (
                      ""
                    ) : (
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Archive Property"
                      >
                        <div
                          className="w-100"
                          onClick={() => openArchiveModal(property)}
                        >
                          <button href="#" className="btn btn-color">
                            <Link href="#">
                              <span className="text-light">
                                {" "}
                                <FaArchive />
                              </span>
                            </Link>
                          </button>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ),
          };
          tempData.push(updatedRow);
          tempStatusData.push(newStatus);
        }
      });
      setfilteredPropertiesCount(tempData?.length);
      const filteredData = sortTheDataList(tempData, sortDesc);
      setUpdatedData(filteredData);
      setStatusData(filteredData);
    };
    getData();
  }, [properties, wishlist, bids, sortDesc]);

  useEffect(() => {
    setPropertiesPerPage(updatedData.slice(start, end));
  }, [start, end, updatedData]);

  const refreshHandler = () => {
    setProperties([]);
    setWishlist([]);
    setBids([]);
    setRefresh(true);
    setStartLoading(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProperties([]);
        setWishlist([]);
        setBids([]);
        setSearchInput("");
        setFilterQuery("All");

        const data = JSON.parse(localStorage.getItem("user"));
        const token = data?.token;

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const archiveRes = await axios.get("/api/getArchiveAppraiserProperty", {
          headers,
          params: { userId: data?.userId },
        });

        const {
          success: archSuccess,
          message: archMsg,
          data: archiveData,
        } = archiveRes?.data;
        if (archSuccess) {
          const temp = archiveData?.$values;
          const requiredProperties = temp?.map((p) => p?.property);
          setArchivedProperties(requiredProperties);
        }

        // if (data?.userType === 3) {
        try {
          const listedRes = await axios.get("/api/getAllListedProperties", {
            headers,
            params: { userId: data?.userId },
          });

          const {
            success: listSuccess,
            message: listMsg,
            data: listedData,
          } = listedRes?.data;
          if (listSuccess) {
            const properties = listedData?.properties?.$values;
            setProperties(properties);
            setDataFetched(true);
          }

          const bidsRes = await axios.get("/api/getAllBids", {
            headers,
            params: { email: data?.userEmail },
          });

          const {
            success: bidsSuccess,
            message: bidsMsg,
            data: bidsData,
          } = bidsRes?.data;
          if (bidsSuccess) {
            setBids(bidsData?.$values);
          }

          const wishlistRes = await axios.get(
            "/api/appraiserWishlistedProperties",
            {
              headers,
            }
          );

          const {
            success: wishSuccess,
            message: wishMsg,
            data: wishlistData,
          } = wishlistRes?.data;
          if (wishSuccess) {
            const tempData = wishlistData?.$values;
            const responseData = tempData?.filter(
              (prop) => String(prop?.userId) === String(data?.userId)
            );
            setWishlist(responseData);
          }
        } catch (err) {
          handleError(err);
          setDataFetched(false);
        }
        // }

        const brokerRes = await axios.get("/api/getAllBrokers", { headers });
        const {
          success: brokerSuccess,
          message: brokerMsg,
          data: brokerData,
        } = brokerRes?.data;
        let allbroker = [];
        if (brokerSuccess) {
          allbroker = brokerData?.$values;
        }

        const brokerageRes = await axios.get("/api/getAllBrokerageCompany", {
          headers,
        });
        const { success, message, data: brokerageData } = brokerageRes?.data;
        let allbrokerage = [];
        if (success) {
          allbrokerage = brokerageData?.$values;
        }

        const updated = [...(allbroker ?? []), ...(allbrokerage ?? [])];
        setAllBrokers(updated);

        const appraiserRes = await axios.get("/api/getAllAppraiser", {
          headers,
        });
        const {
          success: apprSuccess,
          message: apprMsg,
          data: appraiserData,
        } = appraiserRes?.data;
        if (apprSuccess) {
          setAllAppraiser(appraiserData?.$values);
        }
      } catch (err) {
        handleError(err);
      }

      setRefresh(false);
    };

    fetchData();
  }, [refresh]);

  function handleError(err) {
    const msg = err?.response?.data?.error || "Unexpected error";
    toast.error(msg);
    setErrorMessage(msg);
    setModalIsOpenError(true);
  }

  return (
    <>
      {refresh ? (
        <Loader />
      ) : (
        <SmartTable
          title=""
          setSearchInput={setSearchInput}
          setFilterQuery={setFilterQuery}
          data={propertiesPerPage}
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
          statusData={statusData}
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
              Order Confirmation - Property Id{" "}
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
                onClick={() =>
                  onArchivePropertyHandler(selectedProperty?.orderId)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {wishlistModal ? (
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
              Order Confirmation - Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              Are you sure for the order to be{" "}
              <span className="text-danger fw-bold">Wishlist</span> ?
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
                onClick={() => onWishlistHandler(selectedProperty.propertyId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {isWishlistProperty ? (
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
              Order Confirmation - Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              Are you sure for the order to be{" "}
              <span className="text-danger fw-bold">Remove Wishlist</span> ?
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
                // onClick={() => onWishlistHandler(selectedProperty.propertyId)}
                onClick={handleConfirmRemoveWishlist}
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

      {isLimitModalOpen ? (
        <div className="modal">
          <div className="modal-content" style={{ width: "25%" }}>
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
              Information <span style={{ color: "#97d700" }}></span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              You&apos;ve hit your subscription limit.
              <br />
              Kindly Top Up.{" "}
              {/* <span className="text-danger fw-bold">Top Up</span>{" "} */}
            </p>
            <div
              className="mb-3 mt-4"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div className="col-lg-12 d-flex justify-content-center gap-2">
              <button
                // disabled={disable}
                className="btn btn-color w-25"
                onClick={() => setIsLimitModalOpen(false)}
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
