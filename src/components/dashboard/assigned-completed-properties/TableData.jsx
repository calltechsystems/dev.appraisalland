"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Exemple from "./Exemple";
import { useDispatch, useSelector } from "react-redux";
const TableData = ({
  userData,
  open,
  setGeneratedProps,
  close,
  setAssignedAppraiserInfo,
  setAssignModal,
  setAssignPropertyId,
  setAssignedProp,
  setAssignedAppraiser,
  setCurrentBid,
  openAppraiserInfoModal,
  setShowBroker,
  setOpenAssignModal,
  setAllBrokers,
  setShowMore,
  setFilterQuery,
  setSearchInput,
  setIsStatusModal,
  start,
  end,
  searchInput,
  filterQuery,
  onWishlistHandler,
  setStartLoading,
  setUpdatedCode,
  openModalBroker,
  participateHandler,
  properties,
  setProperties,
  setErrorMessage,
  setAssignAppraisers,
  setModalIsOpenError,
  setRefresh,
  refresh,
  setSelectedPropertyNew,
  setCurrentBiddedView,
  setOpenQuoteView,
}) => {
  let userInfo = {};
  const [Id, setId] = useState(-1);

  const [rerender, setRerender] = useState(false);

  const [data, setData] = useState([]);

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
        const { success, data, message } = res?.data;
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
          searchInput={searchInput}
          filterQuery={filterQuery}
          openAppraiserInfoModal={openAppraiserInfoModal}
          setRefresh={setRefresh}
          refresh={refresh}
          setGeneratedProps={setGeneratedProps}
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
          setAssignedAppraiserInfo={setAssignedAppraiserInfo}
          setAssignedAppraiser={setAssignedAppraiser}
          openModalBroker={openModalBroker}
          setAllBrokers={setAllBrokers}
          setCurrentBid={setCurrentBid}
          setOpenAssignModal={setOpenAssignModal}
          end={end}
          setAssignAppraisers={setAssignAppraisers}
          setAssignModal={setAssignModal}
          setAssignPropertyId={setAssignPropertyId}
          setAssignedProp={setAssignedProp}
          setSelectedPropertyNew={setSelectedPropertyNew}
          setCurrentBiddedView={setCurrentBiddedView}
          setOpenQuoteView={setOpenQuoteView}
        />
      )}
    </>
  );
};

export default TableData;
