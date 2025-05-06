const AllStatistics = ({
  totalBids,
  acceptedBids,
  totalPropertiesCount,
  totalCompletedPropertiesCount,
  totalAcceptPropertiesCount,
  totalPendingPropertiesCount,
  planData,
}) => {
  const allStatistics = [
    // New cards for Plans
    {
      id: 9,
      blockStyle: "stylecardnew9",
      icon: "fa fa-dollar",
      timer: planData ? planData[2] : 0, // Ultimate Plan count
      name: "Ultimate Plans",
    },
    {
      id: 8,
      blockStyle: "stylecardnew8",
      icon: "fa fa-star-half",
      timer: planData ? planData[1] : 0, // Pro Plan count
      name: "Pro Plans",
    },
    {
      id: 7,
      blockStyle: "stylecardnew7",
      icon: "fa fa-star-o",
      timer: planData ? planData[0] : 0, // Lite Plan count
      name: "Lite Plans",
    },
    {
      id: 1,
      blockStyle: "stylecardnew1",
      icon: "fa fa-user",
      timer: totalBids,
      name: "Total Mortgage Brokers",
    },
    {
      id: 2,
      blockStyle: "stylecardnew2",
      icon: "fa fa-users",
      timer: acceptedBids,
      name: "Total Active Mortgage Brokers",
    },
    {
      id: 3,
      blockStyle: "stylecardnew3",
      icon: "fa fa-file",
      timer: totalPropertiesCount,
      name: "Total Submitted Properties",
    },
    {
      id: 4,
      blockStyle: "stylecardnew4",
      icon: "fa fa-check",
      timer: totalAcceptPropertiesCount,
      name: "Total Accepted Properties",
    },
    {
      id: 6,
      blockStyle: "stylecardnew6",
      icon: "fa fa-check-circle",
      timer: totalCompletedPropertiesCount,
      name: "Total Completed Properties",
    },
    {
      id: 5,
      blockStyle: "stylecardnew5",
      icon: "fa fa-edit",
      timer: totalPendingPropertiesCount,
      name: "Total Cancelled Properties",
    },
    // {
    //   id: 5,
    //   blockStyle: "stylecardnew5",
    //   icon: "fa fa-edit",
    //   timer: totalPendingPropertiesCount,
    //   name: " Total Appraisals In Progress ",
    // },
  ];

  return (
    <>
      {allStatistics.map((item) => (
        // <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3" key={item.id}>
        <div className="col-lg-4" key={item.id}>
          <div key={item.id} className={`ff_one ${item.blockStyle}`}>
            <div className="details">
              <div className="timer">{item.name}</div>
              <p>{item.timer}</p>
            </div>
            <div className="icon">
              <i className={item.icon}></i>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AllStatistics;
