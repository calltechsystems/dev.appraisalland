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
  close,
  setAssignAppraiserId,
  setCurrentViewAppraiser,
  setOpenViewModal,
  setAppraiserCompanyInfo,
  setSelectedAppraiser,
  setAppraiser,
  setallListedAssignAppraiser,
  setOpenEditModal,
  setFilterQuery,
  setCloseRegisterModal,
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
        toast.dismiss();
        const {
          success: brokerSuccess,
          data: brokerData,
          message: brokerMessage,
        } = res?.data;
        if (brokerSuccess) {
          setRerender(true);
        } else {
          toast.error(
            brokerMessage ?? "An error occurred while updating the record."
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
          setallListedAssignAppraiser={setallListedAssignAppraiser}
          setAppraiser={setAppraiser}
          close={close}
          setSearchInput={setSearchInput}
          setFilterQuery={setFilterQuery}
          setProperties={setProperties}
          properties={data}
          setAssignAppraiserId={setAssignAppraiserId}
          setRefresh={setRefresh}
          setOpenEditModal={setOpenEditModal}
          refresh={refresh}
          setSelectedAppraiser={setSelectedAppraiser}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          onWishlistHandler={onWishlistHandler}
          participateHandler={participateHandler}
          setUpdatedCode={setUpdatedCode}
          setStartLoading={setStartLoading}
          openModalBroker={openModalBroker}
          setIsStatusModal={setIsStatusModal}
          setCurrentViewAppraiser={setCurrentViewAppraiser}
          setOpenViewModal={setOpenViewModal}
          setAppraiserCompanyInfo={setAppraiserCompanyInfo}
          setCloseRegisterModal={setCloseRegisterModal}
          start={start}
          end={end}
        />
      )}
    </>
  );
};

export default TableData;
