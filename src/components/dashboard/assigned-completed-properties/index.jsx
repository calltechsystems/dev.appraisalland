import Header from "../../common/header/dashboard/HeaderAppraiserCompany";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_002";
import MobileMenu from "../../common/header/MobileMenu_01";
import TableData from "./TableData";
import Pagination from "./Pagination";
import { use, useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import Modal from "./Modal";
import { encryptionData } from "../../../utils/dataEncryption";
import Loader from "./Loader";
import { AppraiserStatusOptions } from "../create-listing/data";
import Link from "next/link";
import Image from "next/image";
import Select from "react-select";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [AssignedAppraiserInfo, setAssignedAppraiserInfo] = useState({});
  const [orderStatus, setOrderStatus] = useState(-1);
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [allBrokers, setAllBrokers] = useState([]);
  const [property, setProperty] = useState("");
  const [typeView, setTypeView] = useState(0);
  const [startLoading, setStartLoading] = useState(false);
  const [filterProperty, setFilterProperty] = useState("");
  const [generatedProp, setGeneratedProps] = useState([]);
  const [showPropDetails, setShowPropDetails] = useState(false);
  const [filterQuery, setFilterQuery] = useState("All");
  const [searchQuery, setSearchQuery] = useState("city");
  const [properties, setProperties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [lowRangeBid, setLowRangeBid] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [selectedPropertyNew, setSelectedPropertyNew] = useState(null);
  const [allAssignedprop, setAssignedProp] = useState([]);
  const [openQuoteView, setOpenQuoteView] = useState(false);
  const [currentBiddedView, setCurrentBiddedView] = useState({});
  const [openAppraiser, setOpenAppraiser] = useState(false);

  const [disable, setDisble] = useState(false);

  const [assignModal, setAssignModal] = useState(false);

  const [AssignAppraisers, setAssignAppraisers] = useState([]);
  const [wishlistedProperties, setWishlistedProperties] = useState([]);
  const [updatedCode, setUpdatedCode] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const [modalIsOpenError, setModalIsOpenError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

  const [start, setStart] = useState(0);

  const [end, setEnd] = useState(4);

  // Prepare options
  const options = [
    { value: 0, label: "Select" },
    {
      value: "self",
      label: <span style={{ fontWeight: "bold", color: "purple" }}>Self</span>,
    },
    ...AssignAppraisers.filter(
      (item) => item.isActive && AssignedAppraiserInfo.userId !== item.userId
    ).map((item) => ({
      value: item.id,
      label: `${item.firstName} ${item.lastName}`,
    })),
  ];

  const [showConfirmation, setShowConfirmation] = useState(false);
  const closeErrorModal = () => {
    setModalIsOpenError(false);
  };
  const [remark, setRemark] = useState("");
  const [currentBid, setCurrentBid] = useState(-1);
  const handleStatusUpdateHandler = () => {
    setDisble(true);

    const data = JSON.parse(localStorage.getItem("user"));
    const payload = {
      token: data.token,
      quoteId: currentBid.bidId,
      orderStatus: Number(orderStatus),
      remark: remark,
      statusDate: statusDate,
    };

    const encryptedBody = encryptionData(payload);
    toast.loading("Updating order status!!");
    axios
      .put("/api/updateOrderStatus", encryptedBody)
      .then((res) => {
        toast.dismiss();
        const { success, data: orderData, message } = res?.data;
        if (success) {
          toast.success("Successfully updated!!");
          location.reload(true);
        } else {
          toast.error(
            message ?? "An error occurred while updating the record."
          );
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });

    setRemark("");
    setCurrentBid({});
    setIsStatusModal(false);
  };

  const [openAssignModal, setOpenAssignModal] = useState(false);

  const closeStatusUpdateHandler = () => {
    setOpenDate(false);
    setSelectedPropertyNew(null);
    setIsStatusModal(false);
  };

  const [searchedProperties, setSearchedProperties] = useState([]);

  const [openBrokerModal, setOpenBrokerModal] = useState(false);
  const [broker, setBroker] = useState({});

  const closeBrokerModal = () => {
    setOpenBrokerModal(false);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const openQuoteModal = () => {
    setIsModalOpen(false);
    setIsQuoteModalOpen(true);
  };

  const [openDate, setOpenDate] = useState(false);
  const [statusDate, setStatusDate] = useState("");

  const handleStatusSelect = (value) => {
    if (String(value) === "Appraisal Visit Confirmed") {
      setOpenDate(true);
    }
    if (String(value) !== "Appraisal Visit Confirmed") {
      setOpenDate(false);
    }
    let selectedValue = 0;
    AppraiserStatusOptions?.map((prop, index) => {
      if (String(prop.type) === String(value)) {
        selectedValue = prop.id;
      }
    });

    setOrderStatus(selectedValue);
  };

  const [appraiser, setAppraiser] = useState({});
  const openAppraiserInfoModal = (info) => {
    setOpenAppraiser(true);
    setAppraiser(info);
  };

  function getMinDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    // Format the date as YYYY-MM-DDTHH:mm
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  let [selectedBroker, setSelectedBroker] = useState({});
  const openModalBroker = (property, value) => {
    allBrokers.map((broker) => {
      if (String(broker.userId) === String(property.userId)) {
        setSelectedBroker(broker);
      }
    });

    setBroker(property);

    setTypeView(value);
    setOpenBrokerModal(true);
  };

  const formatPhoneNumber = (number) => {
    if (!number) return ""; // Handle empty input

    // Remove non-numeric characters
    const digits = number.replace(/\D/g, "");

    // Format the number as "416 123-4567"
    if (digits.length <= 3) {
      return digits; // e.g., "416"
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`; // e.g., "416 123"
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`; // e.g., "416 123-4567"
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",

      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const [assignPropertyId, setAssignPropertyId] = useState(-1);
  const [assignAppraiserId, setAssignAppraiserId] = useState(-1);
  const openAppraisalModal = (val) => {
    setOpenAssignModal(true);
    setAssignPropertyId(val);
  };


  const router = useRouter();
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );

  useEffect(() => {
    const activityHandler = () => {
      setLastActivityTimestamp(Date.now());
    };

    // Attach event listeners for user activity
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("click", activityHandler);

    // Cleanup event listeners when the component is unmounted
    return () => {
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("click", activityHandler);
    };
  }, []);

  useEffect(() => {
    // Check for inactivity every minute
    const inactivityCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivityTimestamp;

      // Check if there has been no activity in the last 10 minutes (600,000 milliseconds)
      if (timeSinceLastActivity > 600000) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    }, 60000); // Check every minute

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(inactivityCheckInterval);
  }, [lastActivityTimestamp]);

  const openModal = (property, status) => {
    setProperty(property);
    if (status === 1) {
      setShowPropDetails(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setShowPropDetails(false);
  };
  const setShowBroker = () => {};

  const closeAssignModal = () => {
    setAssignModal(false);
    setSelectedAppraiser({});
    setAssignedAppraiserInfo({});
    setAssignPropertyId(-1);
  };

  useEffect(() => {
    const filterProperties = (propertys, searchInput) => {
      if (searchInput === "") {
        return propertys;
      }
      const filteredProperties = properties.filter((property) => {
        // Convert the search input to lowercase for a case-insensitive search
        const searchTerm = searchInput.toLowerCase();

        if (String(property.orderId) === String(searchTerm)) {
          return true;
        }
        // Check if any of the fields contain the search term
        else
          return (
            String(property.orderId).toLowerCase().includes(searchTerm) ||
            property.postalCode?.toLowerCase().includes(searchTerm) ||
            property.area?.toLowerCase().includes(searchTerm) ||
            property.city?.toLowerCase().includes(searchTerm) ||
            property.province?.toLowerCase().includes(searchTerm) ||
            property.streetName?.toLowerCase().includes(searchTerm) ||
            property.streetNumber?.toLowerCase().includes(searchTerm) ||
            property.typeOfBuilding?.toLowerCase().includes(searchTerm)
          );
      });
      return filteredProperties;
    };
    const filteredData = filterProperties(properties, searchInput);
    setSearchedProperties(filteredData);
  }, [searchInput]);

  const calculate = (searchDate, diff) => {
    const newDateObj = new Date(searchDate.addedDatetime);
    const currentObj = new Date();

    const getMonthsFDiff = currentObj.getMonth() - newDateObj.getMonth();
    const gettingDiff = currentObj.getDate() - newDateObj.getDate();
    const gettingYearDiff = currentObj.getFullYear() - newDateObj.getFullYear();

    const estimatedDiff =
      gettingDiff + getMonthsFDiff * 30 + gettingYearDiff * 365;

    return estimatedDiff <= diff;
  };

  const filterData = (tempData) => {
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    switch (filterQuery) {
      case "Last 7 days":
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        return tempData.filter((item) => calculate(item, 7));
      case "Last 30 Days":
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        return tempData.filter((item) => calculate(item, 30));
      case "Last 3 Month":
        const threeMonthsAgo = new Date(currentDate);
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        return tempData.filter((item) => calculate(item, 90));

      default:
        return tempData; // Return all data if no valid timeFrame is specified
    }
  };

  useEffect(() => {
    const tmpData = filterData(properties);
    setFilterProperty(tmpData);
  }, [filterQuery, generatedProp]);

  const handleDelete = () => {
    const data = JSON.parse(localStorage.getItem("user"));

    toast.loading("deleting this property");
    axios
      .delete("/api/deleteBrokerPropertyById", {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        params: {
          propertyId: property.propertyId,
        },
      })
      .then((res) => {
        const { success, data: brokerData, message } = res?.data;
        if (success) {
          setRerender(true);
        } else {
          toast.error(
            message ?? "An error occurred while deleting the record."
          );
        }
      })
      .catch((err) => {
        toast.error(err);
      });
    toast.dismiss();
    closeModal();
  };

  useEffect(() => {
    setIsLoading(false);
  }, [updatedCode]);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      router.push("/login");
    }
    if (!data) {
      router.push("/login");
    }
    const fetchData = () => {
      if (data) {
        setUserData(data);
      }
    };
    fetchData();
  }, []);


  const [isUpdateBid, setIsUpdateBid] = useState(false);
  const [bidAmount, setbidAmount] = useState(0);
  const [alreadyBidded, setAlreadyBidded] = useState(false);

  const closeQuoteViewModal = () => {
    setOpenQuoteView(false);
    setCurrentBiddedView({});
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
    };

    const originalDate = new Date(dateString);

    // Adjust for Eastern Standard Time (EST) by subtracting 5 hours
    const estDate = new Date(originalDate.getTime() - 5 * 60 * 60 * 1000);

    // Format the EST date
    const formattedDate = estDate.toLocaleString("en-US", options);
    return formattedDate;
  };

  const participateHandler = (val, id, isUpdate, value, isBidded) => {
    if (isUpdate) {
      setLowRangeBid(val);
      setIsUpdateBid(isUpdate);
      setbidAmount(value);
      setPropertyId(id);
      setAlreadyBidded(isBidded);
      setModalOpen(true);
    } else {
      setLowRangeBid(val);
      setPropertyId(id);
      setAlreadyBidded(isBidded);
      setModalOpen(true);
    }
  };

  const [selectedAppraiser, setSelectedAppraiser] = useState({});

  const assignAppraiserUpdateHandler = async () => {
    if (!selectedAppraiser) {
      toast.error("Please select an appropriate appraiser!");
      return;
    }

    try {
      const data = JSON.parse(localStorage.getItem("user"));
      if (!data || !data.token) {
        toast.error("User authentication failed. Please log in again.");
        return;
      }

      const payload = {
        companyId: data.appraiserCompanyDetail?.appraiserCompanyId,
        propertyId: Number(assignPropertyId),
        appraiserId:
          selectedAppraiser == "self"
            ? 0
            : Number(
                selectedAppraiser === -1
                  ? AssignAppraisers[0]?.id
                  : selectedAppraiser
              ),
        isSelfAssigned: selectedAppraiser == "self",
      };

      if (
        !payload.companyId ||
        !payload.propertyId ||
        (!payload.appraiserId && selectedAppraiser != "self")
      ) {
        toast.error("Invalid Fields. Please check the inputs and try again.");
        return;
      }

      const encryptedData = encryptionData(payload);

      toast.loading("Assigning the property...");
      const response = await axios.post(
        "/api/assignPropertyToAppraiser",
        encryptedData,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      toast.dismiss();
      toast.success("Property successfully assigned!");
      setAssignPropertyId(-1);
      setTimeout(() => {
        window.location.reload(); // Reload after the success message is shown
      }, 1000);
    } catch (err) {
      toast.dismiss();

      if (err.response) {
        // Extract status and server error message
        const { status, data } = err.response;
        const errorMessage = data?.message || "An error occurred";

        if (status === 400) {
          // Specific message for 400 errors
          toast.error(`Error 400: ${errorMessage}`);
        } else {
          // Generic message for other status codes
          toast.error(`Error ${status}: ${errorMessage}`);
        }
      } else if (err.request) {
        // No response received from server
        toast.error("No response from server. Please try again later.");
      } else {
        // Axios or unexpected error
        toast.error(`Unexpected error: ${err.message}`);
      }
    }
  };


  const onWishlistHandler = (id) => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const formData = {
      userId: userData.userId,
      propertyId: id,
      token: userData.token,
    };

    const payload = encryptionData(formData);
    toast.loading("Setting this property into your wishlist");
    axios
      .post("/api/addToWishlist", payload)
      .then((res) => {
        toast.dismiss();
        const { success, data: wishlistData, message } = res?.data;
        if (success) {
          toast.success("Successfully added !!! ");
          location.reload(true);
        } else {
          toast.error(message ?? "An error occurred while adding the record.");
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });
  };

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header userData={userData} />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50 dashboard-height">
        <div className="container-fluid ovh table-padding container-padding">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">

                <div className="col-lg-12 col-xl-12"></div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="">
                    <div className="property_table">
                      <div className="mt0">
                        <TableData
                          userData={userData}
                          setModalOpen={openModal}
                          setIsStatusModal={setIsStatusModal}
                          close={closeModal}
                          setProperties={setProperties}
                          start={start}
                          end={end}
                          setAllBrokers={setAllBrokers}
                          setAssignedProp={setAssignedProp}
                          setGeneratedProps={setGeneratedProps}
                          properties={
                            searchInput === "" && filterQuery === "All"
                              ? properties
                              : searchInput !== ""
                              ? searchedProperties
                              : filterProperty
                          }
                          searchInput={searchInput}
                          filterQuery={filterQuery}
                          setAssignAppraisers={setAssignAppraisers}
                          setUpdatedCode={setUpdatedCode}
                          setAssignedAppraiserInfo={setAssignedAppraiserInfo}
                          onWishlistHandler={onWishlistHandler}
                          participateHandler={participateHandler}
                          setErrorMessage={setErrorMessage}
                          setModalIsOpenError={setModalIsOpenError}
                          setShowBroker={setShowBroker}
                          setRefresh={setRefresh}
                          setFilterQuery={setFilterQuery}
                          setSearchInput={setSearchInput}
                          setShowMore={setShowMore}
                          setOpenAssignModal={setOpenAssignModal}
                          refresh={refresh}
                          openAppraiserInfoModal={openAppraiserInfoModal}
                          setCurrentBid={setCurrentBid}
                          setWishlistedProperties={setWishlistedProperties}
                          setStartLoading={setStartLoading}
                          openModalBroker={openModalBroker}
                          setAssignModal={setAssignModal}
                          setAssignPropertyId={setAssignPropertyId}
                          setAssignedAppraiser={openAppraisalModal}
                          setSelectedPropertyNew={setSelectedPropertyNew}
                          setCurrentBiddedView={setCurrentBiddedView}
                          setOpenQuoteView={setOpenQuoteView}
                        />

                        {modalIsOpenError && (
                          <div className="modal">
                            <div
                              className="modal-content"
                              style={{ width: "20%" }}
                            >
                              <div className="row">
                                <div className="col-lg-12">
                                  <Link href="/" className="">
                                    <Image
                                      width={50}
                                      height={45}
                                      className="logo1 img-fluid"
                                      style={{ marginTop: "-25px" }}
                                      src="/assets/images/Appraisal_Land_Logo.png"
                                      alt="header-logo2.png"
                                    />
                                    <span
                                      style={{
                                        color: "#2e008b",
                                        fontWeight: "bold",
                                        fontSize: "22px",
                                        // marginTop: "20px",
                                      }}
                                    >
                                      Appraisal
                                    </span>
                                    <span
                                      style={{
                                        color: "#97d700",
                                        fontWeight: "bold",
                                        fontSize: "22px",
                                        // marginTop: "20px",
                                      }}
                                    >
                                      {" "}
                                      Land
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <h3 className="text-center mt-2 text-color">
                                Error
                              </h3>
                              <div
                                style={{
                                  borderWidth: "2px",
                                  borderColor: "orangered",
                                }}
                              >
                                <div
                                  className="mt-1 mb-3"
                                  style={{ border: "2px solid #97d700" }}
                                ></div>
                              </div>
                              <h5 className="text-center text-dark">
                                {errorMessage}
                              </h5>
                              <div
                                className="mt-2 mb-3"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <div className="text-center">
                                <button
                                  className="btn btn-color w-25"
                                  onClick={closeErrorModal}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {openBrokerModal && typeView === 1 && (
                          <div className="modal">
                            <div className="modal-content">
                              <div className="row">
                                <div className="col-lg-12 d-flex justify-content-between">
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
                              <div className="row">
                                <div className="col-lg-12 text-center">
                                  <h2 className=" text-color mt-1">
                                    Property Details – Property Id{"  "}
                                    <span style={{ color: "#97d700" }}>
                                      #{broker.orderId}
                                    </span>
                                  </h2>
                                </div>
                              </div>
                              <div
                                className="mb-3 mt-2"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <div
                                className="d-flex justify-content-center"
                                id="property-info-container"
                              >
                                <table id="table-broker-info">
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Property Address
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {" "}
                                        {broker.streetNumber}{" "}
                                        {broker.streetName} {broker.city}{" "}
                                        {broker.province} {broker.postalCode}
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          {" "}
                                          Property Type{" "}
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {broker.typeOfBuilding}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          {" "}
                                          Type of Appraisal
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {broker.typeOfAppraisal}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          {" "}
                                          Purpose
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {broker.purpose}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          {" "}
                                          Lender Information
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {broker.lenderInformation
                                          ? broker.lenderInformation
                                          : "N.A."}
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Estimated Value / Purchased Price
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        $
                                        {addCommasToNumber(
                                          broker.estimatedValue
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Urgency
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {" "}
                                        {broker.urgency === 0
                                          ? "Rush"
                                          : broker.urgency === 1
                                          ? "Regular"
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Appraisal Report Required By
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {broker.quoteRequiredDate
                                          ? formatDate(broker.quoteRequiredDate)
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Remark / Summary
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {" "}
                                        {broker.remark ? broker.remark : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Applicant Name
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {" "}
                                        {broker.applicantFirstName}{" "}
                                        {broker.applicantLastName}
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          {" "}
                                          Applicant Email Address{" "}
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {broker.applicantEmailAddress}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Applicant Phone Number
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {" "}
                                        {formatPhoneNumber(
                                          broker.applicantPhoneNumber
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="d-flex justify-content-center gap-2 mt-3">
                                <button
                                  className="btn btn-color"
                                  style={{ width: "100px" }}
                                  onClick={closeBrokerModal}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {openBrokerModal && typeView === 2 && (
                          <div className="modal">
                            <div className="modal-content">
                              <div className="row">
                                <div className="col-lg-12 d-flex justify-content-between">
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
                              <div className="row">
                                <div className="col-lg-12 text-center">
                                  <h2 className=" text-color mt-1">
                                    Mortgage Broker Details – Property Id{"  "}
                                    <span style={{ color: "#97d700" }}>
                                      #{broker.orderId}
                                    </span>
                                  </h2>
                                </div>
                              </div>
                              <div
                                className="mt-2 mb-3"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <div
                                className="d-flex justify-content-center"
                                id="broker-info-container"
                              >
                                <table id="table-broker-info">
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="table-header">
                                        <span>Mortgage Broker Name</span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.firstName}{" "}
                                        {selectedBroker.lastName}
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Company Name
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.companyName
                                          ? selectedBroker.companyName
                                          : selectedBroker.brokerageName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Email Address
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.emailId}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Phone Number
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {formatPhoneNumber(
                                          selectedBroker.phoneNumber
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Cell Number
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.cellNumber
                                          ? formatPhoneNumber(
                                              selectedBroker.cellNumber
                                            )
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Mortgage Broker Licence No.
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.mortageBrokerLicNo}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Mortgage Brokerage Licence No.
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.mortageBrokerageLicNo}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Address
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker?.address?.streetNumber}{" "}
                                        {selectedBroker?.address?.streetName}{" "}
                                        {
                                          selectedBroker?.address
                                            ?.apartmentNumber
                                        }{" "}
                                        {selectedBroker?.address?.city}{" "}
                                        {selectedBroker?.address?.province}{" "}
                                        {selectedBroker?.address?.postalCode}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="d-flex justify-content-center gap-2 mt-3">
                                <button
                                  className="btn btn-color"
                                  style={{ width: "100px" }}
                                  onClick={closeBrokerModal}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {openAppraiser && (
                          <div className="modal">
                            <div className="modal-content">
                              <div className="row">
                                <div className="col-lg-12">
                                  <Link href="/" className="">
                                    <Image
                                      width={50}
                                      height={45}
                                      className="logo1 img-fluid"
                                      style={{ marginTop: "-20px" }}
                                      src="/assets/images/Appraisal_Land_Logo.png"
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
                              <div className="row">
                                <div className="col-lg-12 text-center">
                                  <h1 className=" text-color mt-1">
                                    Appraiser Details – Property Id{"  "}
                                    <span style={{ color: "#97d700" }}>
                                      #{propertyId}
                                    </span>
                                  </h1>
                                </div>
                              </div>
                              <div
                                className="mt-2 mb-3"
                                style={{ border: "2px solid #97d700" }}
                              ></div>

                              <div
                                className="d-flex justify-content-center"
                                id="broker-info-container"
                              >
                                <table id="table-broker-info">
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Appraiser Name
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {appraiser.firstName}{" "}
                                        {appraiser.lastName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Company Name
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {appraiser.companyName
                                          ? appraiser.companyName
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Phone Number
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {formatPhoneNumber(
                                          appraiser.phoneNumber
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Email Address
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {appraiser.emailId}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Cell Number
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {appraiser.cellNumber
                                          ? formatPhoneNumber(
                                              appraiser.cellNumber
                                            )
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Address
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {appraiser.streetNumber}{" "}
                                        {appraiser.streetName},{" "}
                                        {appraiser.apartmentNumber}{" "}
                                        {appraiser.city} {appraiser.state}{" "}
                                        {appraiser.postalCode}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Applicant Name
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {appraiser.assistantFirstName
                                          ? appraiser.assistantFirstName
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Applicant Phone Number
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {appraiser.assistantPhoneNumber
                                          ? formatPhoneNumber(
                                              appraiser.assistantPhoneNumber
                                            )
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Applicant Email Address
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {appraiser.assistantEmailAddress
                                          ? appraiser.assistantEmailAddress
                                          : "N.A."}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                `
                              </div>
                              <div className="row text-center">
                                <div className="col-lg-12 d-flex justify-content-center gap-2 mt-3">
                                  <button
                                    className="btn btn-color text-center"
                                    style={{ width: "100px" }}
                                    onClick={() => setOpenAppraiser(false)}
                                  >
                                    Ok
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* End .property_table */}
                  </div>
                </div>
                {/* End .col */}
              </div>
              {isQuoteModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <h3 className="text-center">
                      Quote Confirmation – Property Id{"  "}
                      <span style={{ color: "#97d700" }}>#{propertyId}</span>
                    </h3>
                    <h5 className="text-center">
                      Are you sure you want to quote this property over this
                      amount :{valueRef?.current?.value} ?
                    </h5>
                    {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                    <div className="text-center" style={{}}>
                      <button
                        className="btn w-35 btn-thm3 m-2"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                      <button
                        className="btn w-35 btn-white"
                        onClick={closeQuoteModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isStatusModal && (
                <div className="modal">
                  <div className="modal-content" style={{ width: "35%" }}>
                    {showConfirmation ? (
                      // Confirmation Message
                      <div>
                        <div className="col-lg-12">
                          <Link href="/" className="">
                            <Image
                              width={50}
                              height={45}
                              className="logo1 img-fluid"
                              style={{ marginTop: "-20px" }}
                              src="/assets/images/Appraisal_Land_Logo.png"
                              alt="header-logo2.png"
                            />
                            <span
                              style={{
                                color: "#2e008b",
                                fontWeight: "bold",
                                fontSize: "24px",
                              }}
                            >
                              Appraisal
                            </span>
                            <span
                              style={{
                                color: "#97d700",
                                fontWeight: "bold",
                                fontSize: "24px",
                              }}
                            >
                              {" "}
                              Land
                            </span>
                          </Link>
                        </div>
                        <h3
                          className="text-center mt-3"
                          style={{ color: "#2e008b" }}
                        >
                          Confirm Submission – Property Id{" "}
                          <span style={{ color: "#97d700" }}>
                            #{selectedPropertyNew.orderId}
                          </span>
                        </h3>
                        <div
                          className="mb-4"
                          style={{ border: "2px solid #97d700" }}
                        ></div>
                        <p className="text-center" style={{ fontSize: "18px" }}>
                          Are you sure you want to proceed with the changes?
                        </p>
                        <div
                          className="mt-4 mb-4"
                          style={{ border: "2px solid #97d700" }}
                        ></div>
                        <div className="text-center">
                          <button
                            className="btn w-25 btn-color"
                            onClick={() => setShowConfirmation(false)} // Go back to the form
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-color w-25"
                            style={{ marginLeft: "12px" }}
                            onClick={() => {
                              handleStatusUpdateHandler();
                              setShowConfirmation(false); // Close confirmation on submission
                            }}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Form Content
                      <div>
                        <div className="row">
                          <div className="col-lg-12">
                            <Link href="/" className="">
                              <Image
                                width={50}
                                height={45}
                                className="logo1 img-fluid"
                                style={{ marginTop: "-20px" }}
                                src="/assets/images/Appraisal_Land_Logo.png"
                                alt="header-logo2.png"
                              />
                              <span
                                style={{
                                  color: "#2e008b",
                                  fontWeight: "bold",
                                  fontSize: "24px",
                                }}
                              >
                                Appraisal
                              </span>
                              <span
                                style={{
                                  color: "#97d700",
                                  fontWeight: "bold",
                                  fontSize: "24px",
                                }}
                              >
                                {" "}
                                Land
                              </span>
                            </Link>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 text-center">
                            <h3 className=" text-color mt-3">
                              Appraisal Status – Property Id{" "}
                              <span style={{ color: "#97d700" }}>
                                #{selectedPropertyNew.orderId}
                              </span>
                            </h3>
                          </div>
                        </div>
                        <div
                          className="mb-4"
                          style={{ border: "2px solid #97d700" }}
                        ></div>
                        <select
                          required
                          className="form-select mb-3"
                          data-live-search="true"
                          data-width="100%"
                          onChange={(e) => handleStatusSelect(e.target.value)}
                          style={{
                            paddingTop: "15px",
                            paddingBottom: "15px",
                            backgroundColor: "#E8F0FE",
                          }}
                        >
                          {AppraiserStatusOptions.map((item, index) => (
                            <option key={item.id} value={item.value}>
                              {item.type}
                            </option>
                          ))}
                        </select>
                        {openDate && (
                          <div className="col-lg-12">
                            <label
                              style={{
                                color: "#2e008b",
                                fontWeight: "bold",
                                fontSize: "18px",
                              }}
                            >
                              Date and Time{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              required
                              type="datetime-local"
                              className="form-control"
                              id="formGroupExampleInput3"
                              onChange={(e) => setStatusDate(e.target.value)}
                              value={statusDate}
                              min={getMinDateTime()}
                              onKeyDown={(e) => e.preventDefault()} // Prevent keyboard interaction
                            />
                          </div>
                        )}
                        <div className="mt-3">
                          <h4 style={{ color: "#2e008b", fontWeight: "bold" }}>
                            Remark
                          </h4>
                          <textarea
                            className="form-control mb-3"
                            id="formGroupExampleInput3"
                            onChange={(e) => setRemark(e.target.value)}
                            value={remark}
                            style={{ overflow: "auto", resize: "vertical" }}
                            maxLength="300"
                            rows="4"
                            placeholder="Enter your remark here..."
                          ></textarea>
                        </div>
                        <div
                          className="mb-3 mt-2"
                          style={{ border: "2px solid #97d700" }}
                        ></div>
                        <div className="text-center">
                          <button
                            className="btn w-25 btn-color"
                            onClick={closeStatusUpdateHandler}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-color w-25"
                            style={{ marginLeft: "12px" }}
                            onClick={() => {
                              if (openDate && !statusDate) {
                                toast.error("Date and time required.");
                              } else {
                                setShowConfirmation(true); // Toggle to show confirmation
                              }
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {openQuoteView && (
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
                            src="/assets/images/Appraisal_Land_Logo.png"
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
                    <h3 className="text-center mt-2 text-color">
                      Provided Quote – Property Id{" "}
                      <span style={{ color: "#97d700" }}>
                        #{currentBiddedView.orderId}
                      </span>
                    </h3>
                    <div>
                      <div
                        className="mt-2 mb-3"
                        style={{ border: "2px solid #97d700" }}
                      ></div>
                    </div>
                    <p className="text-center fs-5 text-dark">
                      The Last Provided Quote was{" "}
                      <span
                        style={{
                          color: "#97d700",
                          fontWeight: "bold",
                          fontSize: "22px",
                        }}
                      >
                        ${addCommasToNumber(currentBiddedView?.bidAmount)}
                      </span>
                    </p>
                    <p className="text-center fs-6 text-dark">
                      Updated At :{" "}
                      {formatDateTime(currentBiddedView?.requestTime)}
                    </p>

                    <div className="text-center" style={{}}>
                      <div>
                        <div
                          className="mt-2 mb-3"
                          style={{ border: "2px solid #97d700" }}
                        ></div>
                      </div>
                      <button
                        className="btn btn-color w-25"
                        onClick={closeQuoteViewModal}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {assignModal && (
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
                            src="/assets/images/Appraisal_Land_Logo.png"
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
                    <div className="row">
                      <div className="col-lg-12 text-center">
                        <h3 className=" text-color mt-3">
                          Re-Asssign Appraiser – Property Id{"  "}
                          <span style={{ color: "#97d700" }}>
                            #{selectedPropertyNew?.orderId}
                          </span>
                        </h3>
                      </div>
                    </div>
                    <div
                      className="mt-2 mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <Select
                      options={options}
                      onChange={(selectedOption) =>
                        setSelectedAppraiser(selectedOption.value)
                      }
                      placeholder="Select Appraiser"
                      styles={{
                        control: (base) => ({
                          ...base,
                          padding: "5px",
                          backgroundColor: "#E8F0FE",
                        }),
                      }}
                      isSearchable
                    />
                    {/* <select
                      required
                      className="form-select"
                      data-live-search="true"
                      data-width="100%"
                      onChange={(e) => setSelectedAppraiser(e.target.value)}
                      style={{
                        padding: "15px",
                        backgroundColor: "#E8F0FE",
                      }}
                    >
                      <option value={0}>Select</option>;
                      <option key={"self"} value={"self"}>
                        <span style={{ fontWeight: "bold", color: "purple" }}>
                          Self
                        </span>
                      </option>
                      {AssignAppraisers.map((item, index) => {
                        return item.isActive &&
                          AssignedAppraiserInfo.userId !== item.userId ? (
                          <option key={item.id} value={item.id}>
                            {item.firstName} {item.lastName}
                          </option>
                        ) : null;
                      })}
                    </select> */}
                    <div
                      className="mt-4 mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div className="text-center" style={{}}>
                      <button
                        className="btn btn-color m-1 w-25"
                        onClick={() => closeAssignModal()}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-color w-25"
                        onClick={assignAppraiserUpdateHandler}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <Modal
                  modalOpen={modalOpen}
                  setIsModalOpen={setIsModalOpen}
                  closeModal={closeModal}
                  lowRangeBid={lowRangeBid}
                  currentBid={currentBid}
                  propertyId={propertyId}
                  openQuoteModal={openQuoteModal}
                  closeQuoteModal={closeQuoteModal}
                />
              </div>
              <div className="row">{/* End paginaion .col */}</div>
              {/* End .row */}
            </div>
            {/* End .row */}

            <div className="row mt50">
              <div className="col-lg-12">
                <div className="copyright-widget-dashboard text-center">
                  <p>
                    &copy; {new Date().getFullYear()} Appraisal Land. All Rights
                    Reserved.
                  </p>
                </div>
              </div>
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
