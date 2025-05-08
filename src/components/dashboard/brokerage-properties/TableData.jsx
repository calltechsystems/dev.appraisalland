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
  onHoldHandler,
  onCancelHandler,
  properties,
  setPropertyId,
  setPropValue,
  refresh,
  setRefresh,
  setModalIsPopupOpen,
  archievePropertyHandler,
  setWishlist,
  setCurrentProperty,
  searchInput,
  setProperties,
  setFilterQuery,
  setSearchInput,
  setModalIsOpenError,
  setErrorMessage,
  setModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
  setHoldModalOpen,
  currentPage,
  totalPages,
  handlePageChange,
  setfilteredPropertiesCount,
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
          setPropValue={setPropValue}
          setPropertyId={setPropertyId}
          close={close}
          setProperties={setProperties}
          properties={data}
          setRefresh={setRefresh}
          refresh={refresh}
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
          setWishlist={setWishlist}
          searchInput={searchInput}
          setModalOpen={setModalOpen}
          setHoldModalOpen={setHoldModalOpen}
          setIsCancelProperty={setIsCancelProperty}
          setIsHoldProperty={setIsHoldProperty}
          currentPage={currentPage} // Pass current page
          totalPages={totalPages} // Pass total pages
          handlePageChange={handlePageChange} // Pass function
          setfilteredPropertiesCount={setfilteredPropertiesCount}
        />
      )}
    </>
  );
};

export default TableData;
