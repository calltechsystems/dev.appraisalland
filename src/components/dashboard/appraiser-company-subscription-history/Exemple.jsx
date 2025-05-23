import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import toast from "react-hot-toast";
import axios from "axios";
// import "./SmartTable.css";

const headCells = [
  {
    id: "sno",
    numeric: false,
    label: "S. No",
    width: 50,
  },
  {
    id: "id",
    numeric: false,
    label: "Transaction ID / Payment ID",
    width: 150,
  },
  {
    id: "planName",
    numeric: false,
    label: "Selected Plan",
    width: 120,
  },
  {
    id: "planType",
    numeric: false,
    label: "Plan Type",
    width: 120,
  },

  {
    id: "st_date",
    numeric: false,
    label: "Start / Purchase Date",
    width: 150,
  },
  {
    id: "end_date",
    numeric: false,
    label: "End Date",
    width: 150,
  },
  {
    id: "amount",
    numeric: false,
    label: "Amount",
    width: 100,
  },
  // {
  //   id: "remained_prop",
  //   numeric: false,
  //   label: "Used Properties",
  //   width: 100,
  // },
  {
    id: "status",
    numeric: false,
    label: "Status",
    width: 200,
  },
];

export default function Exemple({
  userData,
  data,
  open,
  dataFetched,
  setRefresh,
  setStartLoading,
  setDataFetched,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [show, setShow] = useState(false);
  let tempData = [];

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);

    return formattedDate;
  };

  useEffect(() => {
    if (data.result) {
      if ((data?.result?.$values).length === 0) {
        setDataFetched(true);
      }
    }
  }, [data]);

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.status);
      const dateB = new Date(b.status);
      return dateB - dateA;
    });
  };

  useEffect(() => {
    const getData = () => {
      data?.map((property, index) => {
        if (true) {
          const updatedRow = {
            sno: index + 1,
            id: property.paymentid,
            planName: property?.planName || "N.A.",
            planType: <span>{property?.planType}</span>,
            amount: property.planAmount ? `$${property.planAmount}` : "$ -",
            st_date:
              property?.planName === "Top Up"
                ? "N.A."
                : formatDate(property.startDate),
            end_date: formatDate(property.endDate),
            remained_prop: `${
              property.usedProperties === null ? 0 : property.usedProperties
            } of ${property.noOfProperties}`,
            status: !property.isActive ? (
              (new Date() > new Date(property.startDate) &&
                property?.planName !== "Top Up") ||
              (new Date() > new Date(property.endDate) &&
                property?.planName == "Top Up") ? (
                <span style={{ color: "red" }}> Expired</span>
              ) : (
                <span className="btn btn-info">
                  {property?.planName == "Top Up"
                    ? `Will Be Active till ${formatDate(property.endDate)}`
                    : `Will Be Active on ${formatDate(property.startDate)}}`}
                </span>
              )
            ) : (
              <span className="btn btn-success" style={{ width: "50%" }}>
                Active
              </span>
            ),
          };
          tempData.push(updatedRow);
        }
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [data]);

  const refreshHandler = () => {
    setRefresh(true);
    setStartLoading(true);
  };

  useEffect(() => {
    let tempProperties = [];
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };
  }, [data]);
  return (
    <>
      {updatedData && (
        <SmartTable
          title=""
          properties={updatedData}
          dataFetched={dataFetched}
          data={sortObjectsByOrderIdDescending(updatedData)}
          headCells={headCells}
          refreshHandler={refreshHandler}
        />
      )}
    </>
  );
}
