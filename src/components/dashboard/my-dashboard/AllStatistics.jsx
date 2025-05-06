import React, { useMemo } from "react";

const AllStatistics = ({ dashboardCount }) => {
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

  const allStatistics = useMemo(() => {
    const stats = [
      {
        section: "Plan Details",
        id: "PlanAndStatus",
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
        visibleFor: [1],
      },
      {
        section: "Plan Details",
        id: "PlanValidityCount",
        blockStyle: "stylecardnew10",
        icon: "fa fa-hourglass-half",
        value: formatDate(dashboardCount?.planValidity),
        name: "Plan Validity",
        visibleFor: [1],
      },
      {
        section: "Plan Details",
        id: "NoOfPropertiesCount",
        blockStyle: "stylecardnew11",
        icon: "fa fa-building",
        value: dashboardCount?.noOfProperties || 0,
        name: "No. of Properties",
        visibleFor: [1],
      },
      {
        section: "Plan Details",
        id: "RemainingPropertiesCount",
        blockStyle: "stylecardnew12",
        icon: "fa fa-home",
        value: dashboardCount?.remainingProperties || 0,
        name: "Remaining Properties",
        visibleFor: [1],
      },
      {
        section: "Property Details",
        id: "allPropertiesCount",
        blockStyle: "stylecardnew1",
        icon: "fa fa-home",
        value: dashboardCount?.propertiesListed || 0,
        name: "All Properties",
        visibleFor: [1, 6],
      },
      {
        section: "Property Details",
        id: "QuotesInProgressCount",
        blockStyle: "stylecardnew4",
        icon: "fa fa-edit",
        value: dashboardCount?.quotesInProgress || 0,
        name: "New Quotes",
        visibleFor: [1],
      },
      {
        section: "Property Details",
        id: "quotesProvidedCount",
        blockStyle: "stylecardnew2",
        icon: "fa fa-file",
        value: dashboardCount?.quotesProvided || 0,
        name: "Quotes Received",
        visibleFor: [1, 6],
      },
      {
        section: "Property Details",
        id: "quoteAccepted",
        blockStyle: "stylecardnew3",
        icon: "fa fa-hourglass-half",
        value: dashboardCount?.quotesAccepted || 0,
        name: "Quotes Accepted",
        visibleFor: [1, 6],
      },
      {
        section: "Property Details",
        id: "QuotesCompletedCount",
        blockStyle: "stylecardnew5",
        icon: "fa fa-check",
        value: dashboardCount?.quotesCompleted || 0,
        name: "Quotes Completed",
        visibleFor: [1, 6],
      },
      {
        section: "Property Details",
        id: "QuotesOnHoldCount",
        blockStyle: "stylecardnew6",
        icon: "fa fa-pause",
        value: dashboardCount?.quotesOnHoldByBroker || 0,
        name: "Properties on Hold",
        visibleFor: [1, 6],
      },
      {
        section: "Property Details",
        id: "CancelledPropertiesCount",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        value: dashboardCount?.cancelledPropertiesByBroker || 0,
        name: "Properties Cancelled",
        visibleFor: [1, 6],
      },
      {
        section: "Property Details",
        id: "OnHoldPropertiesCount",
        blockStyle: "stylecardnew8",
        icon: "fa fa-pause",
        value: dashboardCount?.quotesOnHoldByAppriaser || 0,
        name: "Properties on Hold By Appraiser",
        visibleFor: [1, 6],
      },
    ];

    return stats.filter((stat) =>
      userTypes.some((type) => stat.visibleFor.includes(type))
    );
  }, [dashboardCount, userTypes]);

  const groupedStatistics = allStatistics.reduce((groups, stat) => {
    const section = stat.section || "Other";
    if (!groups[section]) groups[section] = [];
    groups[section].push(stat);
    return groups;
  }, {});

  return (
    <div className="statistics-container">
      {Object.entries(groupedStatistics).map(([section, items]) => (
        <div key={section} style={{ width: "100%", marginBottom: "30px" }}>
          <h4
            className="heading-forms"
            style={{ marginBottom: "15px", color: "#000" }}
          >
            {section}
          </h4>
          <div
            className="statistics-section"
            style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}
          >
            {items.map((item) => (
              <div key={item.id} className={`ff_one ${item.blockStyle}`}>
                <div className="details">
                  <div className="timer">{item.name}</div>
                  {item.isCombined ? (
                    <p style={{ fontSize: "21px", fontWeight: "bold" }}>
                      {item.value.planName}{" "}
                      <span
                        style={{
                          backgroundColor:
                            item.value.subscriptionStatus === "Active"
                              ? "#28a745"
                              : "#dc3545",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          marginLeft: "8px",
                          fontSize: "15px",
                        }}
                      >
                        {item.value.subscriptionStatus}
                      </span>
                    </p>
                  ) : (
                    <p>{item.value}</p>
                  )}
                </div>
                <div className="icon">
                  <i className={item.icon}></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllStatistics;
