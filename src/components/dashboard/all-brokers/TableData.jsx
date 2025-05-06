"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Exemple from "./Exemple";
const TableData = ({
  userData,
  open,
  close,
  selectedBroker,
  setSelectedBroker,
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
  setCurrentViewBroker,
  setOpenViewModal,
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
            brokerMessage ?? "An error occurred while deleting the record."
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
          setSearchInput={setSearchInput}
          setFilterQuery={setFilterQuery}
          setProperties={setProperties}
          properties={data}
          setRefresh={setRefresh}
          refresh={refresh}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          onWishlistHandler={onWishlistHandler}
          participateHandler={participateHandler}
          setUpdatedCode={setUpdatedCode}
          setStartLoading={setStartLoading}
          openModalBroker={openModalBroker}
          setIsStatusModal={setIsStatusModal}
          setCloseRegisterModal={setCloseRegisterModal}
          selectedBroker={selectedBroker}
          setSelectedBroker={setSelectedBroker}
          start={start}
          end={end}
          setCurrentViewBroker={setCurrentViewBroker}
          setOpenViewModal={setOpenViewModal}
        />
      )}
    </>
  );
};

export default TableData;
