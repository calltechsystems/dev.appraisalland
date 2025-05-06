"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Exemple from "./Exemple";
import { useDispatch, useSelector } from "react-redux";
const TableData = ({
  userData,
  searchInput,
  filterQuery,
  wishlist,
  setWishlist,
  open,
  close,
  setAssignedAppraiser,
  setAssignPropertyId,
  setAssignModal,
  setAllAppraiser,
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
  setSelectedPropertyNew,
  refresh,
  setIsLoading,
}) => {
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
            message ?? "An error occurred while updating the record."
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
          searchInput={searchInput}
          filterQuery={filterQuery}
          refresh={refresh}
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
          setAssignPropertyId={setAssignPropertyId}
          onArchivePropertyHandler={onArchivePropertyHandler}
          setAssignedAppraiser={setAssignedAppraiser}
          openModalBroker={openModalBroker}
          setAllBrokers={setAllBrokers}
          setCurrentBid={setCurrentBid}
          setAllAppraiser={setAllAppraiser}
          setAssignModal={setAssignModal}
          setOpenAssignModal={setOpenAssignModal}
          end={end}
          wishlist={wishlist}
          setWishlist={setWishlist}
          setSelectedPropertyNew={setSelectedPropertyNew}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
};

export default TableData;
