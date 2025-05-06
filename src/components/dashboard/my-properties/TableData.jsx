"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Exemple from "./Exemple";
const TableData = ({
  userData,
  open,
  close,
  properties,
  setProperties,
  setModalIsOpenError,
  setErrorMessage,
}) => {
  const [Id, setId] = useState(-1);
  const [rerender, setRerender] = useState(false);
  const [data, setData] = useState([]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // Use 12-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);

    return formattedDate;
  };

  useEffect(() => {
    setData(properties);
  }, [properties]);
  const deletePropertyHandler = (id) => {
    const data = JSON.parse(localStorage.getItem("user"));

    axios
      .delete("/api/deleteBrokerPropertyById", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          propertyId: id,
        },
      })
      .then((res) => {
        const { success, data: propData, message } = res?.data;
        if (success) {
          setRerender(true);
        } else {
          toast.error(
            message ?? "An error occurred while deleting the record."
          );
        }
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  };

  const toggleDropdownDiv = (item) => {};

  let tbodyContent = data?.map((item, key) => (
    <>
      <tr key={item.id}>
        <td scope="row">
          <div className="details">
            <div className="tc_content">
              <h4>{item.title}</h4>
              <p>
                <span className="flaticon-placeholder"></span>
                {item.area} {item.city} {item.state} postalCode-
                {item.postalCode}
              </p>
              <Link className="fp_price text-thm" href="#">
                ${item.bidLowerRange} - ${item.bidUpperRange}
                <small>/estimated</small>
              </Link>
            </div>
          </div>
        </td>
        {/* End td */}

        <td>{formatDate(item?.addedDatetime)}</td>
        {/* End td */}

        <td>
          <span className="status_tag badge">Pending</span>
        </td>
        {/* End td */}

        <td>2,345</td>
        {/* End td */}

        <td>
          <ul className="view_edit_delete_list mb0">
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              data-placement="top"
              title="View"
            >
              <Link href={`/create-listing/${item.propertyId}`}>
                <span className="flaticon-view"></span>
              </Link>
            </li>
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              data-placement="top"
              title="Edit"
            >
              <Link href={`/create-listing/${item.propertyId}`}>
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
                onClick={() => open(item)}
              >
                <Link href="#">
                  <span className="flaticon-garbage"></span>
                </Link>
              </button>
            </li>
          </ul>
        </td>
        {/* End td */}
      </tr>
      {Id === key ? <tr>property data </tr> : ""}
    </>
  ));

  return (
    <>
      {data && (
        <Exemple
          userData={userData}
          open={open}
          close={close}
          setProperties={setProperties}
          properties={data}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
        />
      )}
    </>
  );
};

export default TableData;
