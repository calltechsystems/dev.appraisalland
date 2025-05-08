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
  setProperties,
  setIsModalOpenBid,
  propertyId,
  setModalIsOpenError,
  setErrorMessage,
  property,
  setAppInfo,
  setOpenBrokerModal,
  setid,
  setAllAppraiser,
  refresh,
  setRefresh,
  setProperty,
  setIsLoading,
}) => {
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
        alert(err.response.data.error);
      });
  };

  return (
    <>
      {data && (
        <Exemple
          userData={userData}
          open={open}
          close={close}
          setProperties={setProperties}
          properties={properties}
          propertyId={propertyId}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          setIsModalOpenBid={setIsModalOpenBid}
          property={property}
          setOpenBrokerModal={setOpenBrokerModal}
          setProperty={setProperty}
          setAppInfo={setAppInfo}
          setId={setid}
          refresh={refresh}
          start={start}
          setIsLoading={setIsLoading}
          end={end}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
};

export default TableData;
