"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Exemple from "./Exemple";
const TableData = ({
  userData,
  open,
  close,
  onWishlistHandler,
  setUpdatedCode,
  setIsLoading,
  participateHandler,
  properties,
  setProperties,
  setErrorMessage,
  setModalIsOpenError,
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
          setProperties={setProperties}
          properties={data}
          setUpdatedCode={setUpdatedCode}
          setIsLoading={setIsLoading}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          onWishlistHandler={onWishlistHandler}
          participateHandler={participateHandler}
        />
      )}
    </>
  );
};

export default TableData;
