"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Exemple from "./Exemple";
import { useDispatch, useSelector } from "react-redux";
const TableData = ({
  userData,
  setOpenQuoteView,
  setCurrentBiddedView,
  searchInput,
  filterQuery,
  setRequiredProp,
  open,
  close,
  setAssignedAppraiser,
  onArchivePropertyHandler,
  setCurrentBid,
  setShowBroker,
  setOpenAssignModal,
  setAllBrokers,
  setShowMore,
  setFilterQuery,
  setSearchInput,
  setIsStatusModal,
  start,
  end,
  onWishlistHandler,
  setStartLoading,
  setUpdatedCode,
  openModalBroker,
  participateHandler,
  properties,
  setProperties,
  setErrorMessage,
  setModalIsOpenError,
  setRefresh,
  refresh,
}) => {
  let userInfo = {};
  const [Id, setId] = useState(-1);

  const [rerender, setRerender] = useState(false);

  const [data, setData] = useState([]);


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    axios
      .get("/api/getAllListedProperties", {
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
        const { success, data: listedData, message } = res?.data;
        if (success) {
          setProperties(listedData?.properties?.$values);
          setRerender(false);
        }
      })
      .catch((err) => {
        toast.dismiss();
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });
  }, [rerender]);

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
        const { success, data: brokerData, message } = res?.data;
        if (success) {
          setRerender(true);
        } else {
          toast.error(
            message ?? "An error occurred while deleting the record."
          );
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data.error);
        setModalIsOpenError(true);
      });
  };


  return (
    <>
      {data && (
        <Exemple
          userData={userData}
          open={open}
          close={close}
          setShowBroker={setShowBroker}
          setSearchInput={setSearchInput}
          setFilterQuery={setFilterQuery}
          setProperties={setProperties}
          properties={data}
          setRefresh={setRefresh}
          refresh={refresh}
          searchInput={searchInput}
          filterQuery={filterQuery}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          onWishlistHandler={onWishlistHandler}
          participateHandler={participateHandler}
          setUpdatedCode={setUpdatedCode}
          setStartLoading={setStartLoading}
          setShowMore={setShowMore}
          setIsStatusModal={setIsStatusModal}
          start={start}
          setCurrentBiddedView={setCurrentBiddedView}
          setOpenQuoteView={setOpenQuoteView}
          setRequiredProp={setRequiredProp}
          onArchivePropertyHandler={onArchivePropertyHandler}
          setAssignedAppraiser={setAssignedAppraiser}
          openModalBroker={openModalBroker}
          setAllBrokers={setAllBrokers}
          setCurrentBid={setCurrentBid}
          setOpenAssignModal={setOpenAssignModal}
          setRerender={setRerender}
          end={end}
        />
      )}
    </>
  );
};

export default TableData;
