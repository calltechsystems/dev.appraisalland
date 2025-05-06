import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import toast from "react-hot-toast";
import axios from "axios";
// import "./SmartTable.css";

const headCells = [
  {
    id: "orderId",
    numeric: false,
    label: "Order Id",
    width: 200,
  },
  {
    id: "address",
    numeric: false,
    label: "Address",
    width: 200,
  },
  {
    id: "date",
    numeric: false,
    label: "Submission date",
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
  setUpdatedCode,
  setIsLoading,
  deletePropertyHandler,
  onWishlistHandler,
  participateHandler,
  setErrorMessage,
  setModalIsOpenError,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bids, setBids] = useState([]);

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

  const filterBidsWithin24Hours = (property) => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    let tempBid = 0;
    bids.filter((bid) => {
      if (
        bid.appraiserUserId === userData.userId &&
        bid.propertyId === property.propertyId
      ) {
        tempBid = tempBid + 1;
      } else {
      }
    });
    return tempBid > 0 ? true : false;
  };

  useEffect(() => {
    const getData = () => {
      properties.map((property, index) => {
        const isBidded = filterBidsWithin24Hours(property);
        const updatedRow = {
          address: `${property.city}-${property.state},${property.postalCode}`,
          orderId: property.orderId,
          date: formatDate(property.addedDatetime),
          actions: (
            <div className="print-hidden-column">
              {!isBidded ? (
                <ul className="">
                  {!isBidded && (
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Provide Quote"
                    >
                      <div
                        className="mt-1 fw-bold"
                        onClick={() =>
                          participateHandler(
                            property.bidLowerRange,
                            property.propertyId
                          )
                        }
                      >
                        <a
                          href="#"
                          className="btn btn-color"
                          style={{ marginLeft: "10px" }}
                        >
                          Provide Quote
                        </a>
                      </div>
                    </li>
                  )}
                </ul>
              ) : (
                <h5>Provided</h5>
              )}
            </div>
          ),
        };
        tempData.push(updatedRow);
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [properties]);

  useEffect(() => {
    setUpdatedCode(true);
  }, [updatedData]);

  useEffect(() => {
    let tempProperties = [];
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    toast.loading("Getting properties...");
    const user = JSON.parse(localStorage.getItem("user"));

    toast.loading("Getting all wishlishted properties");
    axios
      .get("/api/appraiserWishlistedProperties", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.dismiss();
        const {
          success: wishlistSuccess,
          data: wishlistData,
          message: wishlistMessage,
        } = res?.data;
        if (wishlistSuccess) {
          const tempData = wishlistData?.$values;
          // setAllWishlistedProperties(res.data.data.$values);
          const responseData = tempData?.filter((prop, index) => {
            if (prop?.userId === data?.userId) {
              return true;
            } else {
              return false;
            }
          });
          const tempId = responseData;
          toast.success("Successfully fetched");
          tempProperties = responseData;

          axios
            .get("/api/getAllListedProperties", {
              headers: {
                Authorization: `Bearer ${user?.token}`,
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              toast.dismiss();
              const {
                success: listSuccess,
                data: listData,
                message: listMessage,
              } = res?.data;
              if (listSuccess) {
                let userWishlistProp = [];
                const tempData = listData?.properties?.$values;
                const selectedData = tempProperties?.filter((prop, index) => {
                  return tempData?.filter((prop2, index) => {
                    if (prop?.propertyId === prop2?.propertyId) {
                      userWishlistProp?.push(prop2);
                      return true;
                    } else return false;
                  });
                });
                setProperties(userWishlistProp);
              }
            })
            .catch((err) => {
              toast.dismiss();
              toast.error(err?.response);
            });
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response);
        setErrorMessage(err?.response);
        setModalIsOpenError(true);
      });
    axios
      .get("/api/getAllBids", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const {
          success: bidSuccess,
          data: bidData,
          message: bidMessage,
        } = res?.data;
        if (bidSuccess) {
          setBids(bidData?.result?.$values);
        }
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
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
