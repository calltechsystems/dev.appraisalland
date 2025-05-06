import Header from "../../common/header/dashboard/HeaderAppraiserCompany";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_002";
import MobileMenu from "../../common/header/MobileMenu_01";
import Filtering from "./Filtering";
import AllStatistics from "./AllStatistics";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Link } from "react-scroll";
import Image from "next/image";

const Index = () => {
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);
  const [FilteringType, setFilteringType] = useState("1000");
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsPlanError, setModalIsPlaneError] = useState(false);
  const [message, setMessage] = useState("");
  const [dashboardCount, setDashboardCount] = useState(null);
  const [subAppraiserDashboardCount, setSubAppraiserDashboardCount] =
    useState(null);

  useEffect(() => {
    const func = () => {
      const data = JSON.parse(localStorage.getItem("user"));
      if (!data) return;
      // setIsLoading(true);

      axios
        .get("/api/getAppraiserCompanyDashboardDetails", {
          headers: {
            Authorization: `Bearer ${data?.token}`,
            "Content-Type": "application/json",
          },
          params: {
            userId: data?.userId,
            noOfDays: FilteringType,
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
  }, [FilteringType, refresh]);

  useEffect(() => {
    const func = () => {
      const data = JSON.parse(localStorage.getItem("user"));
      if (!data) return;
      // setIsLoading(true);

      axios
        .get("/api/getSubAppraiserDashboardDetails", {
          headers: {
            Authorization: `Bearer ${data?.token}`,
            "Content-Type": "application/json",
          },
          params: {
            userId: data?.userId,
            noOfDays: FilteringType,
          },
        })
        .then((res) => {
          const subAppraiserDashboardData = res.data.data;
          setSubAppraiserDashboardCount(subAppraiserDashboardData);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error || "Dashboard fetch failed");
        })
        .finally(() => {
          // setIsLoading(false);
        });
    };

    func();
  }, [FilteringType, refresh]);

  useEffect(() => {
    // Simulate an API call to check the user's plan status
    const fetchUserPlan = async () => {
      try {
        // Replace this with your actual API call
        const userData = JSON.parse(localStorage.getItem("user"));
        console.log("user", userData);
        if (!userData) {
          throw new Error("User not logged in");
        }
        // if (userData?.userType !== 1) {
        //   console.log("Not applicable for this user type.");
        //   return;
        // }

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
    router.push("/appraiser-company-add-subscription");
  };

  const closeErrorModal = () => {
    setModalIsOpenError(false);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUserData(data);
    if (!data) {
      router.push("/login");
    } else if (!data?.appraiserCompany_Datails?.firstName) {
      router.push("/appraiser-company-profile");
    }
    if (!data) {
      router.push("/login");
    }

    setRefresh(false);
  }, [refresh]);

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
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row mb-5">
                {/* Start Dashboard Navigation */}
                {/* <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Dashboard Navigation
                      </button>
                    </div>
                  </div>
                </div> */}
                {/* End Dashboard Navigation */}

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
                      {userData?.appraiserCompany_Datails
                        ? `${userData?.appraiserCompany_Datails?.firstName} ${userData?.appraiserCompany_Datails?.lastName}`
                        : "Name"}
                    </h2>
                  </div>
                  <div>
                    <Filtering
                      setRefresh={setRefresh}
                      setFilteringType={setFilteringType}
                      FilteringType={FilteringType}
                    />
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <AllStatistics
                  dashboardCount={dashboardCount}
                  subAppraiserDashboardCount={subAppraiserDashboardCount}
                />
              </div>
              {/* End .row Dashboard top statistics */}

              {/* <div className="row">
                <div className="col-xl-6">
                  <div className="application_statics">
                    <h4 className="mb-4">View Statistics</h4>
                    {chartData.length > 0 ? (
                      <StatisticsChart data={chartData} />
                    ) : (
                      <StatisticsChart data={chartData} />
                    )}
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="application_statics">
                    <h4 className="mb-4">View Statistics</h4>
                    {chartData.length > 0 ? (
                      <StatisticsPieChart data={chartData} />
                    ) : (
                      <StatisticsPieChart data={chartData} />
                    )}
                  </div>
                </div>
              </div> */}

              {modalIsOpenError && (
                <div className="modal">
                  <div
                    className="modal-content"
                    style={{ borderColor: "orangered", width: "20%" }}
                  >
                    <h3 className="text-center" style={{ color: "orangered" }}>
                      Error
                    </h3>
                    <div
                      style={{
                        borderWidth: "2px",
                        borderColor: "orangered",
                      }}
                    >
                      <br />
                    </div>
                    <h5 className="text-center">{errorMessage}</h5>
                    <div
                      className="text-center"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <button
                        className="btn w-35 btn-white"
                        onClick={() => closeErrorModal()}
                        style={{
                          borderColor: "orangered",
                          color: "orangered",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                        style={{ width: "100px" }}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* End .row  */}

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
