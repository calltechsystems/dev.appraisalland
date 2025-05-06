"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Exemple from "./Exemple";
const TableData = ({
  userData,
  open,
  start,
  end,
  close,
  properties,
  refresh,
  searchInput,
  filterQuery,
  setFilterQuery,
  setSearchInput,
  setModalIsPopupOpen,
  setRefresh,
  setProperties,
  setModalIsOpenError,
  setAllArchive,
  setErrorMessage,
  setPropValue,
  setModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
  setPropertyId,
  setCurrentProperty,
  onHoldHandler,
  onCancelHandler,
  setIsLoading,
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


  return (
    <>
      {data && (
        <Exemple
          userData={userData}
          open={open}
          setFilterQuery={setFilterQuery}
          setSearchInput={setSearchInput}
          close={close}
          setProperties={setProperties}
          properties={data}
          setRefresh={setRefresh}
          refresh={refresh}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          start={start}
          setAllArchive={setAllArchive}
          end={end}
          setModalIsPopupOpen={setModalIsPopupOpen}
          onHoldHandler={onHoldHandler}
          setPropValue={setPropValue}
          setPropertyId={setPropertyId}
          onCancelHandler={onCancelHandler}
          setModalOpen={setModalOpen}
          filterQuery={filterQuery}
          searchInput={searchInput}
          setIsCancelProperty={setIsCancelProperty}
          setIsHoldProperty={setIsHoldProperty}
          setCurrentProperty={setCurrentProperty}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
};

export default TableData;
