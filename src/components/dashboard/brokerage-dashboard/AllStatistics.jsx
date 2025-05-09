
import React, { useMemo } from "react";

const AllStatistics = ({ dashboardCount, subBrokerDashboardCount }) => {
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
      // 🟢 Plan Cards (after merging)
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
        visibleFor: [2],
        section: "plan",
      },
      {
        id: "PlanValidityCount",
        blockStyle: "stylecardnew10",
        icon: "fa fa-hourglass-half",
        value: formatDate(dashboardCount?.planValidity),
        name: "Plan Validity",
        visibleFor: [2],
        section: "plan",
      },
      {
        id: "NoOfPropertiesCount",
        blockStyle: "stylecardnew11",
        icon: "fa fa-building",
        value: dashboardCount?.noOfProperties || 0,
        name: "No. of Properties",
        visibleFor: [2],
        section: "plan",
      },
      {
        id: "RemainingPropertiesCount",
        blockStyle: "stylecardnew12",
        icon: "fa fa-home",
        value: dashboardCount?.remainingProperties || 0,
        name: "Remaining Properties",
        visibleFor: [2],
        section: "plan",
      },

      // 🔵 Brokerage Cards
      {
        id: "allPropertiesCount",
        blockStyle: "stylecardnew1",
        icon: "fa fa-home",
        value: dashboardCount?.propertiesListed || 0,
        name: "All Properties",
        visibleFor: [2],
        section: "brokerage",
      },
      {
        id: "QuotesInProgressCount",
        blockStyle: "stylecardnew4",
        icon: "fa fa-edit",
        value: dashboardCount?.quotesInProgress || 0,
        name: "New Quotes",
        visibleFor: [2],
        section: "brokerage",
      },
      {
        id: "quotesProvidedCount",
        blockStyle: "stylecardnew2",
        icon: "fa fa-file",
        value: dashboardCount?.quotesProvided || 0,
        name: "Quotes Received",
        visibleFor: [2],
        section: "brokerage",
      },
      {
        id: "quoteAccepted",
        blockStyle: "stylecardnew3",
        icon: "fa fa-hourglass-half",
        value: dashboardCount?.quotesAccepted || 0,
        name: "Quotes Accepted",
        visibleFor: [2],
        section: "brokerage",
      },

      {
        id: "QuotesCompletedCount",
        blockStyle: "stylecardnew5",
        icon: "fa fa-check",
        value: dashboardCount?.quotesCompleted || 0,
        name: "Quotes Completed",
        visibleFor: [2],
        section: "brokerage",
      },
      {
        id: "QuotesOnHoldCount",
        blockStyle: "stylecardnew6",
        icon: "fa fa-pause",
        value: dashboardCount?.quotesOnHoldByBroker || 0,
        name: "Properties on Hold",
        visibleFor: [2],
        section: "brokerage",
      },
      {
        id: "CancelledPropertiesCount",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        value: dashboardCount?.cancelledPropertiesByBroker || 0,
        name: "Properties Cancelled",
        visibleFor: [2],
        section: "brokerage",
      },
      {
        id: "CancelledPropertiesCount",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        value: dashboardCount?.quotesOnCancelByAppriaser || 0,
        name: "Properties Cancelled by Appraiser",
        visibleFor: [2],
        section: "brokerage",
      },
      {
        id: "OnHoldPropertiesCount",
        blockStyle: "stylecardnew8",
        icon: "fa fa-pause",
        value: dashboardCount?.quotesOnHoldByAppriaser || 0,
        name: "Properties on Hold By Appraiser",
        visibleFor: [2],
        section: "brokerage",
      },

      // 🟡 Sub-Broker Cards
      {
        id: "SubAllPropertiesCount",
        blockStyle: "stylecardnew1",
        icon: "fa fa-home",
        value: subBrokerDashboardCount?.propertiesListed || 0,
        name: "All Properties",
        visibleFor: [2],
        section: "subbroker",
      },
      {
        id: "SubQuotesInProgress",
        blockStyle: "stylecardnew4",
        icon: "fa fa-edit",
        value: subBrokerDashboardCount?.quotesInProgress || 0,
        name: "New Quotes",
        visibleFor: [2],
        section: "subbroker",
      },
      {
        id: "SubQuotesProvidedCount",
        blockStyle: "stylecardnew2",
        icon: "fa fa-file",
        value: subBrokerDashboardCount?.quotesProvided || 0,
        name: "Quotes Received",
        visibleFor: [2],
        section: "subbroker",
      },
      {
        id: "SubQuoteAccepted",
        blockStyle: "stylecardnew3",
        icon: "fa fa-hourglass-half",
        value: subBrokerDashboardCount?.quotesAccepted || 0,
        name: "Quotes Accepted",
        visibleFor: [2],
        section: "subbroker",
      },
      {
        id: "SubQuotesCompleted",
        blockStyle: "stylecardnew5",
        icon: "fa fa-check",
        value: subBrokerDashboardCount?.quotesCompleted || 0,
        name: "Quotes Completed",
        visibleFor: [2],
        section: "subbroker",
      },
      {
        id: "SubQuotesOnHold",
        blockStyle: "stylecardnew6",
        icon: "fa fa-pause",
        value: subBrokerDashboardCount?.quotesOnHoldByBroker || 0,
        name: "Properties on Hold",
        visibleFor: [2],
        section: "subbroker",
      },
      {
        id: "SubCancelledProperties",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        value: subBrokerDashboardCount?.cancelledPropertiesByBroker || 0,
        name: "Properties Cancelled",
        visibleFor: [2],
        section: "subbroker",
      },
      {
        id: "SubCancelledQuotes",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        value: subBrokerDashboardCount?.quotesOnCancelByAppriaser || 0,
        name: "Properties Cancelled by Appraiser",
        visibleFor: [2],
        section: "subbroker",
      },
      {
        id: "SubHoldByAppraiser",
        blockStyle: "stylecardnew8",
        icon: "fa fa-pause",
        value: subBrokerDashboardCount?.quotesOnHoldByAppriaser || 0,
        name: "Properties on Hold by Appraiser",
        visibleFor: [2],
        section: "subbroker",
      },
    ];

    return stats.filter((stat) =>
      userTypes.some((type) => stat.visibleFor.includes(type))
    );
  }, [dashboardCount, subBrokerDashboardCount, userTypes]);

  // 🔽 Group by section
  const grouped = {
    plan: allStatistics.filter((s) => s.section === "plan"),
    brokerage: allStatistics.filter((s) => s.section === "brokerage"),
    subbroker: allStatistics.filter((s) => s.section === "subbroker"),
  };

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
    <div>
      {renderSection("Plan Details", grouped.plan)}
      {renderSection("Brokerage Statistics", grouped.brokerage)}
      {renderSection("Sub-Broker Statistics", grouped.subbroker)}
    </div>
  );
};

export default AllStatistics;
