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
  open,
  unArchivePropertyHandler,
  setAllArchive,
  allArchive,
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
  setOpenQuoteView,
  setCurrentBiddedView,
}) => {
  let userInfo = {};
  const [Id, setId] = useState(-1);

  const [rerender, setRerender] = useState(false);

  const [data, setData] = useState([]);

  const {
    keyword,
    location,
    status,
    propertyType,
    price,
    bathrooms,
    bedrooms,
    garages,
    yearBuilt,
    area,
    amenities,
  } = useSelector((state) => state.properties);
  const { statusType, featured, isGridOrList } = useSelector(
    (state) => state.filter
  );

  const dispatch = useDispatch();

  // keyword filter
  const keywordHandler = (item) =>
    item.community.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.city.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.area.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.state.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.streetNumber.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.streetName.toLowerCase().includes(keyword?.toLowerCase());

  // location handler
  const locationHandler = (item) => {
    item.city.toLowerCase().includes(keyword?.toLowerCase()) ||
      item.area.toLowerCase().includes(keyword?.toLowerCase()) ||
      item.state.toLowerCase().includes(keyword?.toLowerCase()) ||
      item.streetNumber.toLowerCase().includes(keyword?.toLowerCase()) ||
      item.streetName.toLowerCase().includes(keyword?.toLowerCase());
  };

  // status handler
  const statusHandler = (item) =>
    item.community.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase());

  // properties handler
  const propertiesHandler = (item) =>
    item.community.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase());

  // price handler
  const priceHandler = (item) =>
    item.bidLowerRange < price?.max && item.bidUpperRange > price?.min;

  let theadConent = ["Property Title", "Date", "Urgency", "Bids", "Action"];

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

        setProperties(res.data.data.properties.$values);
        setRerender(false);
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
        setRerender(true);
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
          searchInput={searchInput}
          filterQuery={filterQuery}
          onArchivePropertyHandler={onArchivePropertyHandler}
          setAssignedAppraiser={setAssignedAppraiser}
          openModalBroker={openModalBroker}
          setAllBrokers={setAllBrokers}
          setCurrentBid={setCurrentBid}
          unArchivePropertyHandler={unArchivePropertyHandler}
          setAllArchive={setAllArchive}
          allArchive={allArchive}
          setOpenAssignModal={setOpenAssignModal}
          end={end}
          setCurrentBiddedView={setCurrentBiddedView}
          setOpenQuoteView={setOpenQuoteView}
        />
      )}
    </>
  );
};

export default TableData;
