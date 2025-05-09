import Link from "next/link";
import { useRouter } from "next/router";
import { isSinglePageActive } from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useModal } from "../../../../context/ModalContext";

const SidebarMenu = () => {
  const { setIsModalOpen } = useModal();
  const route = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isBrokerByBrokerage, setIsBrokerByBrokerage] = useState(false);
  const [hasActivePlans, setHasActivePlans] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    setUserData(userData);
    if (userData?.brokerDetail?.brokerageId !== null) {
      setIsBrokerByBrokerage(true);
    }

    // Check if the user has active plans
    const userActivePlans = userData?.userSubscription?.$values || [];
    if (userData?.userType === 6) {
      console.log("Not applicable for this user type.", userData);
      setHasActivePlans(true);
      return;
    }
    setHasActivePlans(userActivePlans.length > 0);
  }, []);

  const manageAccount = [
    {
      id: 1,
      name: "Add / Modify Subscriptions",
      route: "/my-plans",
      icon: "flaticon-money-bag",
    },
    {
      id: 2,
      name: "Transaction History",
      route: "/my-package",
      icon: "flaticon-invoice",
    },
    {
      id: 3,
      name: "Help desk",
      route: "/broker-helpdesk",
      icon: "flaticon-telephone",
    },
    {
      id: 4,
      name: "Contact Us",
      route: "mailto:info@appraisalland.ca",
      icon: "flaticon-envelope",
    },
  ];

  return (
    <>
      <ul className={`sidebar-menu ${isCollapsed ? "collapsed" : ""}`}>
        <li
          className="sidebar_header header"
          style={{ backgroundColor: "white" }}
        >
          <Link href="/">
            <Image
              width={60}
              height={45}
              className="logo1 img-fluid"
              src="/assets/images/Appraisal_Land_Logo.png"
              alt="header-logo2.png"
            />
            <span
              style={{
                color: "#2e008b",
                marginTop: "35px",
                marginLeft: "-10px",
              }}
            >
              Appraisal{" "}
            </span>
            &nbsp;
            <span
              style={{
                color: "#97d700",
                marginTop: "35px",
                paddingLeft: "5px",
              }}
            >
              {" "}
              Land
            </span>
          </Link>
        </li>
        {/* End header */}

        <li className="title">
          <ul>
            <li
              className={`treeview ${
                isSinglePageActive("/my-dashboard", route.pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-dashboard">
                <i className="flaticon-layers"></i>
                <span> Dashboard</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive("/my-properties", route.pathname)
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/my-properties">
                  <i className="flaticon-home"></i>
                  <span>My Properties</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-home"></i>
                  <span>My Properties</span>
                </a>
              )}
            </li>

            {userData?.planLimitExceed === 1 ? (
              <li>
                <Link
                  href="#"
                  className=""
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true); // Open modal globally
                  }}
                >
                  <i className="flaticon-plus"></i>
                  <span>Add New Property</span>
                </Link>
              </li>
            ) : (
              <li
                className={`treeview ${
                  hasActivePlans
                    ? isSinglePageActive("/create-listing", route.pathname)
                      ? "active"
                      : ""
                    : "disabled"
                }`}
              >
                {hasActivePlans ? (
                  <Link href="/create-listing">
                    <i className="flaticon-plus"></i>
                    <span>Add New Property</span>
                  </Link>
                ) : (
                  <a>
                    <i className="flaticon-plus"></i>
                    <span>Add New Property</span>
                  </a>
                )}
              </li>
            )}

            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive("/archive-property", route.pathname)
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/archive-property">
                  <i className="flaticon-home"></i>
                  <span>Archived Properties</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-home"></i>
                  <span>Archived Properties</span>
                </a>
              )}
            </li>
            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive(
                      "/my-completed-properties",
                      route.pathname
                    )
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/my-completed-properties">
                  <i className="flaticon-home"></i>
                  <span>Completed Properties</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-home"></i>
                  <span>Completed Properties</span>
                </a>
              )}
            </li>
          </ul>
        </li>

        <li className="title">
          <span>Manage Account</span>
          {!isBrokerByBrokerage && (
            <ul>
              {manageAccount.map((item) => (
                <li
                  className={`${
                    isSinglePageActive(item.route, route.pathname)
                      ? "active"
                      : !hasActivePlans && item.id === 2
                      ? "disabled"
                      : ""
                  }`}
                  key={item.id}
                >
                  {!hasActivePlans && item.id === 2 ? (
                    <a
                      style={{
                        color: "#999",
                        cursor: "not-allowed",
                        opacity: "0.6",
                      }}
                    >
                      <i className={item.icon}></i> <span>{item.name}</span>
                    </a>
                  ) : (
                    <Link href={item.route}>
                      <i className={item.icon}></i> <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>

        {!isBrokerByBrokerage ? (
          ""
        ) : (
          <li className="link-hover sidebar-menu">
            <Link href="/broker-helpdesk">
              <i className="flaticon-envelope"></i>
              <span>Help Desk</span>
            </Link>
          </li>
        )}
        {!isBrokerByBrokerage ? (
          ""
        ) : (
          <li className="link-hover sidebar-menu">
            <Link href="mailto:patelshubhendra@gmail.com">
              <i className="flaticon-envelope"></i>
              <span>Contact Us</span>
            </Link>
          </li>
        )}
      </ul>
    </>
  );
};

export default SidebarMenu;
