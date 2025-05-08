import Header from "../../common/header/dashboard/HeaderBrokerage";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuBrokerage";
import MobileMenu from "../../common/header/MobileMenu_02";
import Filtering from "./Filtering";
import AllStatistics from "./AllStatistics";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toast";
import { Link } from "react-scroll";
import Image from "next/image";
import axios from "axios";
import { useModal } from "../../../context/ModalContext";

const Index = () => {
  const [userData, setUserData] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData] = useState([]);
  const [bids, setBids] = useState([]);
  const [unfilteredData, setUnfilteredData] = useState([]);
  const [showLineGraph, setShowLineGraph] = useState(false);
  const [filterQuery, setFilterQuery] = useState(1000);
  const [wishlist, setWishlist] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [acceptedBids, setAcceptedBids] = useState(0);
  const [allQuotesBids, setAllQuotesBids] = useState(0);
  const [allProperties, setAllProperties] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const [modalIsPlanError, setModalIsPlaneError] = useState(false);
  const [message, setMessage] = useState("");
  const { isModalOpen, setIsModalOpen } = useModal();
  const [dashboardCount, setDashboardCount] = useState(null);
  const [subBrokerDashboardCount, setSubBrokerDashboardCount] = useState(null);

  useEffect(() => {
    const func = () => {
      const data = JSON.parse(localStorage.getItem("user"));
      if (!data) return;
      // setIsLoading(true);

      axios
        .get("/api/getBrokerageCompanyDashboardDetails", {
          headers: {
            Authorization: `Bearer ${data?.token}`,
            "Content-Type": "application/json",
          },
          params: {
            userId: data?.userId,
            noOfDays: filterQuery,
          },
        })
        .then((res) => {
          const dashboardData = res.data.data;
          setDashboardCount(dashboardData);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error || "Dashboard fetch failed");
        })
        .finally(() => {
          // setIsLoading(false);
        });
    };

    func();
  }, [filterQuery, refresh]);

  useEffect(() => {
    const func = () => {
      const data = JSON.parse(localStorage.getItem("user"));
      if (!data) return;
      // setIsLoading(true);

      axios
        .get("/api/getSubBrokerDashboardDetails", {
          headers: {
            Authorization: `Bearer ${data?.token}`,
            "Content-Type": "application/json",
          },
          params: {
            userId: data?.userId,
            noOfDays: filterQuery,
          },
        })
        .then((res) => {
          const subBrokerDashboardData = res.data.data;
          setSubBrokerDashboardCount(subBrokerDashboardData);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error || "Dashboard fetch failed");
        })
        .finally(() => {
          // setIsLoading(false);
        });
    };

    func();
  }, [filterQuery, refresh]);

  useEffect(() => {
    // Simulate an API call to check the user's plan status
    const fetchUserPlan = async () => {
      try {
        // Replace this with your actual API call
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!userData) {
          throw new Error("User not logged in");
        }

        const userActivePlans = userData?.userSubscription?.$values;
        //  console.log("plans", userActivePlans);

        const haveSubscription =
          userActivePlans?.length > 0
            ? userActivePlans[0]?.$id
              ? true
              : false
            : false;

        if (haveSubscription) {
          setMessage("");
        } else {
          // setMessage("You need an active plan to create a listing.");
          setModalIsPlaneError(true);
        }
      } catch (error) {
        setMessage("Error fetching plan information. Please try again.");
      } finally {
      }
    };

    fetchUserPlan();
  }, []);


  const closePlanErrorModal = () => {
    // setModalIsPlaneError(false);
    router.push("/brokerage-plans");
  };


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

  useEffect(() => {
    let acceptedCount = 0;
    data.map((row, index) => {
      bids.map((bid, idx) => {
        if (String(row.orderId) === String(bid.orderId) && bid.status === 1) {
          acceptedCount += 1;
        }
      });
    });

    setAcceptedBids(acceptedCount);
  }, [data]);

  useEffect(() => {
    setData([]);
    setBids([]);
    const data = JSON.parse(localStorage.getItem("user"));
    setUserData(data);
    if (!data) {
      router.push("/login");
    } else if (!data?.brokerageDetail?.firstName) {
      router.push("/brokerage-profile");
    }

    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    const categorizeDataByMonth = (data) => {
      if (data.length === 0) {
        return Array(12).fill(0);
      }

      const currentMonth = new Date().getMonth();

      const countsByMonth = Array(currentMonth + 1).fill(0);

      data.forEach((property) => {
        const createdAtDate = new Date(property.addedDatetime);
        const month = createdAtDate.getMonth();

        if (month <= currentMonth) {
          countsByMonth[month]++;
        }
      });

      return countsByMonth;
    };
    const temp = categorizeDataByMonth(chartData);
    setLineData(temp);
  }, [chartData]);

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header
        userData={userData ? userData : {}}
        setShowNotification={setShowNotification}
      />

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
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row mb-5">
                <div
                  className="dashboard-header col-lg-12 mb-2 pb-2 pt-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "5px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        color: "#97d700",
                        fontSize: "25px",
                      }}
                    >
                      <span style={{ color: "#2e008b" }}>Welcome</span>{" "}
                      {userData?.brokerageDetail?.firstName
                        ? userData?.brokerageDetail?.firstName
                        : "firstName"}{" "}
                      {userData?.brokerageDetail?.lastName
                        ? userData?.brokerageDetail?.lastName
                        : "lastName"}
                    </h2>
                    {/* <p>We are glad to see you again!</p> */}
                  </div>
                  <div>
                    <Filtering
                      setRefresh={setRefresh}
                      FilterQuery={filterQuery}
                      setFilterQuery={setFilterQuery}
                    />
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <AllStatistics
                  dashboardCount={dashboardCount}
                  subBrokerDashboardCount={subBrokerDashboardCount}
                />
              </div>

              {modalIsPlanError && (
                <div className="modal">
                  <div
                    className="modal-content"
                    style={{ borderColor: "#97d700", width: "30%" }}
                  >
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-12">
                          <Link href="/" className="">
                            <Image
                              width={60}
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
                          <h3 className=" text-color mt-1">Error</h3>
                        </div>
                      </div>
                      <div
                        className="mt-2 mb-3"
                        style={{ border: "2px solid #97d700" }}
                      ></div>
                    </div>
                    <span
                      className="text-center mb-2 text-dark fw-bold"
                      style={{ fontSize: "18px" }}
                    >
                      A valid subscription is required to access Appraisal Land.
                      Please subscribe now to enjoy our full range of services
                    </span>
                    <div
                      className="mt-2 mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div
                      className="col-lg-12 text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <button
                        className="btn btn-color"
                        onClick={() => closePlanErrorModal()}
                        style={{ width: "170px" }}
                      >
                        Subscribe Now
                        {/* <Link href="/my-plans" className="text-white">
                          Subscribe Now
                        </Link> */}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isModalOpen && (
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
                    <h3
                      className="text-center mt-3"
                      style={{ color: "#2e008b" }}
                    >
                      Information <span style={{ color: "#97d700" }}></span>
                    </h3>
                    <div
                      className="mb-2"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
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
                        onClick={() => setIsModalOpen(false)}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="row mt50">
                <div className="col-lg-12">
                  <div className="copyright-widget-dashboard text-center">
                    <p>
                      &copy; {new Date().getFullYear()} Appraisal Land. All
                      Rights Reserved.
                    </p>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
