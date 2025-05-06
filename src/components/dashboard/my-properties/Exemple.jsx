import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
// import "./SmartTable.css";

const headCells = [
  {
    id: "name",
    numeric: false,
    label: "Status",
    width: 200,
  },
  {
    id: "address",
    numeric: false,
    label: "Property Address",
    width: 200,
  },
  {
    id: "user",
    numeric: false,
    label: "Appraiser",
    width: 200,
  },
  {
    id: "amount",
    numeric: false,
    label: "Quote Amount",
    width: 200,
  },
  {
    id: "sub_date",
    numeric: false,
    label: "Submission Date",
    width: 200,
  },
  {
    id: "quote_date",
    numeric: false,
    label: "Quote Date",
    width: 200,
  },
  {
    id: "actions",
    numeric: false,
    label: "Actions",
    width: 200,
  },
];


export default function Exemple({
  userData,
  open,
  close,
  properties,
  setProperties,
  deletePropertyHandler,
}) {
  const [updatedData, setUpdatedData] = useState([]);
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
    const getData = () => {
      properties.map((property, index) => {
        const updatedRow = {
          name: property.propertyStatus ? "Completed" : "Pending",
          address: property.city,
          user: property.applicantEmailAddress,
          amount: property.bidLowerRange,
          sub_date: formatDate(property.addedDatetime),
          quote_date: formatDate(property.addedDatetime),
          actions: (
            <ul className="view_edit_delete_list mb0">
              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="View"
              >
                <Link href={`/create-listing/${property.propertyId}`}>
                  <span className="flaticon-view"></span>
                </Link>
              </li>
              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
              >
                <Link href={`/create-listing/${property.propertyId}`}>
                  <span className="flaticon-edit"></span>
                </Link>
              </li>
              {/* End li */}

              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="Delete"
              >
                <button
                  style={{ border: "none", backgroundColor: "white" }}
                  onClick={() => open(property)}
                >
                  <Link href="#">
                    <span className="flaticon-garbage"></span>
                  </Link>
                </button>
              </li>
            </ul>
          ),
        };
        tempData.push(updatedRow);
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [properties]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    const payload = {
      token: userData.token,
    };

    toast.loading("Getting properties...");
    axios
      .get("/api/getPropertiesById", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.userId,
        },
      })
      .then((res) => {
        toast.dismiss();
        const { success, data: propData, message } = res?.data;
        if (success) {
          setProperties(propData?.property?.$values);
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });
  }, []);
  return (
    <>
      {updatedData && (
        <SmartTable title="" data={updatedData} headCells={headCells} />
      )}
    </>
  );
}
