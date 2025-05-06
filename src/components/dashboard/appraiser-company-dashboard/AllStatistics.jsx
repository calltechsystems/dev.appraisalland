import { useMemo } from "react";

const AllStatistics = ({ dashboardCount, subAppraiserDashboardCount }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userTypes = Array.isArray(userData?.userType)
    ? userData.userType
    : [userData?.userType];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const { planStats, propertyStats, subAppraiserStats } = useMemo(() => {
    const stats = [
      // Plan Data
      {
        id: "PlanCountAndStatus",
        blockStyle: "stylecardnew9",
        icon: "fa fa-credit-card",
        value: {
          planName: dashboardCount?.planName || "-",
          subscriptionStatus: dashboardCount?.subscriptionStatus
            ? "Active"
            : "Inactive",
        },
        name: "Plan & Subscription",
        isCombined: true,
        visibleFor: [4],
        type: "plan",
      },

      {
        id: "PlanValidityCount",
        blockStyle: "stylecardnew10",
        icon: "fa fa-hourglass-half",
        value: formatDate(dashboardCount?.planValidity),
        name: "Plan Validity",
        visibleFor: [4],
        type: "plan",
      },

      // Property Data
      {
        id: "NoOfPropertiesCount",
        blockStyle: "stylecardnew11",
        icon: "fa fa-building",
        value: dashboardCount?.noOfProperties || 0,
        name: "No. of Properties",
        visibleFor: [4],
        type: "plan",
      },
      {
        id: "RemainingPropertiesCount",
        blockStyle: "stylecardnew12",
        icon: "fa fa-home",
        value: dashboardCount?.remainingProperties || 0,
        name: "Remaining Properties",
        visibleFor: [4],
        type: "plan",
      },
      {
        id: "allPropertiesCount",
        blockStyle: "stylecardnew1",
        icon: "fa fa-home",
        value: dashboardCount?.propertiesListed || 0,
        name: "All Properties",
        visibleFor: [4],
        type: "property",
      },
      {
        id: "QuotesInProgressCount",
        blockStyle: "stylecardnew4",
        icon: "fa fa-edit",
        value: dashboardCount?.quotesInProgress || 0,
        name: "New Quotes",
        visibleFor: [4],
        type: "property",
      },
      {
        id: "quotesProvidedCount",
        blockStyle: "stylecardnew2",
        icon: "fa fa-file",
        value: dashboardCount?.quotesProvided || 0,
        name: "Quotes Provided",
        visibleFor: [4],
        type: "property",
      },
      {
        id: "quoteAccepted",
        blockStyle: "stylecardnew3",
        icon: "fa fa-hourglass-half",
        value: dashboardCount?.quotesAccepted || 0,
        name: "Quotes Accepted",
        visibleFor: [4],
        type: "property",
      },
      {
        id: "QuotesCompletedCount",
        blockStyle: "stylecardnew5",
        icon: "fa fa-check",
        value: dashboardCount?.quotesCompleted || 0,
        name: "Quotes Completed",
        visibleFor: [4],
        type: "property",
      },
      {
        id: "QuotesOnHoldCount",
        blockStyle: "stylecardnew6",
        icon: "fa fa-pause",
        value: dashboardCount?.quotesOnHoldByBroker || 0,
        name: "Properties on Hold By Provider",
        visibleFor: [4],
        type: "property",
      },
      {
        id: "CancelledPropertiesCount",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        value: dashboardCount?.cancelledPropertiesByBroker || 0,
        name: "Properties Cancelled",
        visibleFor: [4],
        type: "property",
      },
      {
        id: "OnHoldPropertiesCount",
        blockStyle: "stylecardnew8",
        icon: "fa fa-pause",
        value: dashboardCount?.quotesOnHoldByAppriaser || 0,
        name: "Properties on Hold By Appraiser",
        visibleFor: [4],
        type: "property",
      },
      {
        id: "allPropertiesCount",
        blockStyle: "stylecardnew1",
        icon: "fa fa-home",
        value: subAppraiserDashboardCount?.propertiesListed || 0,
        name: "All Properties",
        visibleFor: [4],
        type: "sub-appraiser",
      },
      {
        id: "QuotesInProgressCount",
        blockStyle: "stylecardnew4",
        icon: "fa fa-edit",
        value: subAppraiserDashboardCount?.quotesInProgress || 0,
        name: "New Quotes",
        visibleFor: [4],
        type: "sub-appraiser",
      },
      {
        id: "quotesProvidedCount",
        blockStyle: "stylecardnew2",
        icon: "fa fa-file",
        value: subAppraiserDashboardCount?.quotesProvided || 0,
        name: "Quotes Provided",
        visibleFor: [4],
        type: "sub-appraiser",
      },
      {
        id: "quoteAccepted",
        blockStyle: "stylecardnew3",
        icon: "fa fa-hourglass-half",
        value: subAppraiserDashboardCount?.quotesAccepted || 0,
        name: "Quotes Accepted",
        visibleFor: [4],
        type: "sub-appraiser",
      },
      {
        id: "QuotesCompletedCount",
        blockStyle: "stylecardnew5",
        icon: "fa fa-check",
        value: subAppraiserDashboardCount?.quotesCompleted || 0,
        name: "Quotes Completed",
        visibleFor: [4],
        type: "sub-appraiser",
      },
      {
        id: "QuotesOnHoldCount",
        blockStyle: "stylecardnew6",
        icon: "fa fa-pause",
        value: subAppraiserDashboardCount?.quotesOnHoldByBroker || 0,
        name: "Properties on Hold By Provider",
        visibleFor: [4],
        type: "sub-appraiser",
      },
      {
        id: "CancelledPropertiesCount",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        value: subAppraiserDashboardCount?.cancelledPropertiesByBroker || 0,
        name: "Properties Cancelled",
        visibleFor: [4],
        type: "sub-appraiser",
      },
      {
        id: "OnHoldPropertiesCount",
        blockStyle: "stylecardnew8",
        icon: "fa fa-pause",
        value: subAppraiserDashboardCount?.quotesOnHoldByAppriaser || 0,
        name: "Properties on Hold By Appraiser",
        visibleFor: [4],
        type: "sub-appraiser",
      },
    ];

    const filteredStats = stats.filter((stat) =>
      userTypes.some((type) => stat.visibleFor.includes(type))
    );

    return {
      planStats: filteredStats.filter((stat) => stat.type === "plan"),
      propertyStats: filteredStats.filter((stat) => stat.type === "property"),
      subAppraiserStats: filteredStats.filter(
        (stat) => stat.type === "sub-appraiser"
      ),
    };
  }, [dashboardCount, subAppraiserDashboardCount, userTypes]);

  const getStatusBadge = (status) => {
    const isActive = status === "Active";
    return (
      <span
        style={{
          backgroundColor: isActive ? "#28a745" : "#dc3545",
          color: "white",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "bold",
        }}
      >
        {status}
      </span>
    );
  };

  const renderSection = (title, items) => (
    <div style={{ marginBottom: "2rem" }}>
      <h3
        className="heading-forms"
        // style={{
        //   marginBottom: "1rem",
        //   borderBottom: "2px solid #ccc",
        //   paddingBottom: "0.5rem",
        // }}
      >
        {title}
      </h3>
      <div className="statistics-container">
        {items.map((item) => (
          <div key={item.id} className={`ff_one ${item.blockStyle}`}>
            <div className="details">
              {item.isCombined ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "21px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Plan - {item.value.planName}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Status : {getStatusBadge(item.value.subscriptionStatus)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="timer">{item.name}</div>
                  <p>{item.value}</p>
                </>
              )}
              {/* <div className="timer">{item.name}</div>
              <p>{item.value}</p> */}
            </div>
            <div className="icon">
              <i className={item.icon}></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="">
      {renderSection("Plan Details", planStats)}
      {/* <hr style={{ margin: "2rem 0", borderTop: "1px solid #ccc" }} /> */}
      {renderSection("Property Details", propertyStats)}
      {renderSection("Sub-Appraiser Property Details", subAppraiserStats)}
    </div>
  );
};

export default AllStatistics;
