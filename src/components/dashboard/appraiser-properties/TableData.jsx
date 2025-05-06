"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
const TableData = ({
  userData,
  open,
  close,
  onWishlistHandler,
  participateHandler,
  properties,
  setProperties,
}) => {
  let userInfo = {};
  const [Id, setId] = useState(-1);

  const [rerender, setRerender] = useState(false);

  const [data, setData] = useState([]);

  const { keyword, price } = useSelector((state) => state.properties);
  let theadConent = ["Property Title", "Date", "Urgency", "Bids", "Action"];

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
          setRerender(false);
        } else {
          toast.error(
            message ?? "An error occurred while updating the record."
          );
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });
  }, [rerender]);
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

  let tbodyContent = data?.map((item, key) => (
    <>
      <tr key={item.id}>
        <td scope="row">
          {/* <div className="feat_property list favorite_page style2" >
          {/*<div className="thumb">
            <Image
              width={150}
              height={220}
              className="img-whp cover"
              src={item.img}
              alt="fp1.jpg"
            />
            <div className="thmb_cntnt">
              <ul className="tag mb0">
                <li className="list-inline-item">
                  <a href="#">For Rent</a>
                </li>
              </ul>
            </div>
         </div> */}
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
          <span className="status_tag badge">
            {item?.urgency === 1
              ? "Low"
              : item?.urgency === 2
              ? "Medium"
              : "High"}
          </span>
        </td>
        {/* End td */}

        <td>2,345</td>
        {/* End td */}

        <td>
          <ul className="view_edit_delete_list mb0">
            {/* <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="View"
          > */}
            {/* <Link href={`/create-listing/${item.propertyId}`} >
              <span className="flaticon-view"></span>
            </Link> */}
            {/* </li> */}
            {/* <li 
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          > */}
            {/* <Link href={`/create-listing/${item.propertyId}`} >
              <span className="flaticon-edit"></span>
            </Link> */}
            {/* </li> */}
            {/* End li */}
            <li
              className="list-inline-item"
              style={{
                width: "30px",
                border: "1px solid black",
                textAlign: "center",
                borderRadius: "5px",
              }}
            >
              {/* <Link href="/agent-v1">{item.posterName}</Link> */}
              <button onClick={() => onWishlistHandler(item.propertyId)}>
                <span className="flaticon-heart text-color "></span>
              </button>
            </li>
          </ul>
          {/* <div className="fp_pdate float-end">{item.postedYear}</div> */}

          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <div
              className="fp_pdate float-end mt-1 fw-bold"
              onClick={() =>
                participateHandler(item.bidLowerRange, item.propertyId)
              }
            >
              <a href="#" className="text-color">
                Participate Bid
              </a>
            </div>
          </li>
        </td>
        {/* End td */}
      </tr>
      {Id === key ? <tr>property data </tr> : ""}
    </>
  ));

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadConent.map((value, i) => (
              <th scope="col" key={i}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        {/* End theaad */}

        <tbody>{tbodyContent}</tbody>
      </table>
    </>
  );
};

export default TableData;
