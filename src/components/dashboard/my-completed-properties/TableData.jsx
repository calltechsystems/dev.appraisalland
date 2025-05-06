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
  searchInput,
  filterQuery,
  onHoldHandler,
  onCancelHandler,
  properties,
  setPropertyId,
  setPropValue,
  refresh,
  setRefresh,
  setModalIsPopupOpen,
  archievePropertyHandler,
  setCurrentProperty,
  setProperties,
  setFilterQuery,
  setSearchInput,
  setModalIsOpenError,
  setErrorMessage,
  setModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
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
        alert(err.response.data.error);
      });
  };


  return (
    <>
      {data && (
        <Exemple
          userData={userData}
          open={open}
          filterQuery={filterQuery}
          setPropValue={setPropValue}
          setPropertyId={setPropertyId}
          close={close}
          setProperties={setProperties}
          properties={data}
          setRefresh={setRefresh}
          refresh={refresh}
          searchInput={searchInput}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          setModalIsPopupOpen={setModalIsPopupOpen}
          setCurrentProperty={setCurrentProperty}
          archievePropertyHandler={archievePropertyHandler}
          start={start}
          end={end}
          onHoldHandler={onHoldHandler}
          onCancelHandler={onCancelHandler}
          setFilterQuery={setFilterQuery}
          setSearchInput={setSearchInput}
          setModalOpen={setModalOpen}
          setIsCancelProperty={setIsCancelProperty}
          setIsHoldProperty={setIsHoldProperty}
        />
      )}
    </>
  );
};

export default TableData;
