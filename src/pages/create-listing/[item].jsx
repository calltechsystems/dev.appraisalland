import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Seo from "../../components/common/seo";
import CreateListing from "../../components/dashboard/create-listing";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Index = () => {
  const router = useRouter();
  const { item } = router.query;
  const [propertyData, setPropertyData] = useState(null);

  useEffect(() => {
    const url = window.location.pathname;

    const propertyOrderId = url.split("/create-listing/")[1];
    const fetchPropertyData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || {});
        const response = await axios.get("/api/getPropertiesById", {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
          params: {
            item: propertyOrderId,
          },
        });
        const { success, message, data: propertyInfo } = response.data;
        if (success) {
          setPropertyData(propertyInfo);
        } else {
          toast.error(message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (item) {
      fetchPropertyData();
    }
  }, [item]);

  return (
    <>
      <Seo pageTitle="Create Listing" />

      {propertyData && (
        <CreateListing isView={true} propertyData={propertyData} />
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
