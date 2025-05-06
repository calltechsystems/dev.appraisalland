import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import axios from "axios";
import Loader from "./Loader";

const headCells = [
  {
    id: "sno",
    numeric: false,
    label: "S. No",
    width: 60,
  },
  {
    id: "username",
    numeric: false,
    label: "User ID",
    width: 200,
  },
  {
    id: "firstname",
    numeric: false,
    label: "First Name",
    width: 120,
  },
  {
    id: "lastname",
    numeric: false,
    label: "Last Name",
    width: 120,
  },
  {
    id: "phone",
    numeric: false,
    label: "Phone",
    width: 150,
  },

  {
    id: "email",
    numeric: false,
    label: "Email Address",
    width: 200,
  },

  {
    id: "date",
    numeric: false,
    label: "Start Date",
    width: 200,
  },
  {
    id: "enddate",
    numeric: false,
    label: "End Date",
    width: 200,
  },
  {
    id: "status",
    numeric: false,
    label: "Status",
    width: 180,
  },
  {
    id: "action",
    numeric: false,
    label: "Action",
    width: 100,
  },
];

export default function Exemple({
  userData,
  setAssignAppraiserId,
  start,
  end,
  setUpdatedCode,
  setAppraiserCompanyInfo,
  setCloseRegisterModal,
  properties,
  setProperties,
  setFilterQuery,
  setSearchInput,
  setErrorMessage,
  setModalIsOpenError,
  setOpenEditModal,
  setSelectedAppraiser,
  setallListedAssignAppraiser,
  setRefresh,
  setStartLoading,
  refresh,
}) {
  const [updatedData, setUpdatedData] = useState([]);

  const [dataFetched, setDataFetched] = useState(false);

  const openEditModalHandler = (appraiser) => {
    setAssignAppraiserId(appraiser.id);
    setSelectedAppraiser(appraiser);
    setOpenEditModal(true);
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    const digits = number.replace(/\D/g, "");
    if (digits.length <= 3) {
      return digits; // e.g., "416"
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`; // e.g., "416 123"
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`; // e.g., "416 123-4567"
    }
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const checkData = properties && !updatedData ? true : false;
  useEffect(() => {
    setProperties([]);
  }, [checkData]);

  useEffect(() => {
    const getData = () => {
      const tempData = [];

      properties?.forEach((data, index) => {
        const updatedRow = {
          sno: index + 1,
          username: data?.userInfo || "-",
          appraiser_id: data.item?.id || "-",
          firstname: data.item?.firstName || "-",
          lastname: data.item?.lastName || "-",
          email: data.item?.emailId || "-",
          status: data.item?.firstName ? (
            data.item?.isActive ? (
              <span className="btn btn-success w-100">Active</span>
            ) : (
              <span className="btn btn-danger w-100">In-Active</span>
            )
          ) : (
            <span className="btn btn-warning w-100">Not Registered</span>
          ),
          phone: data.item?.phoneNumber
            ? formatPhoneNumber(data?.item?.phoneNumber)
            : "-",
          address: data.item?.address?.streetName
            ? `${data?.item?.address?.streetName} ${data?.item?.address?.streetNumber}, ${data?.item?.address?.province}-${data?.item?.address?.postalCode}`
            : "N.A.",
          date: formatDateTime(data.item?.dateEstablished),
          enddate:
            !data.item?.isActive && data.item?.modifiedDateTime
              ? formatDateTime(data.item.modifiedDateTime)
              : "-",
          action: (
            <div className="print-hidden-column">
              {data.item?.firstName && (
                <button
                  className="btn btn-color m-1"
                  onClick={() => openEditModalHandler(data.item)}
                >
                  <i className="flaticon-edit"></i>
                </button>
              )}
            </div>
          ),
        };

        tempData.push(updatedRow);
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [properties]);

  useEffect(() => {
    setUpdatedCode(true);
  }, [updatedData]);

  const refreshHandler = () => {
    setRefresh(true);
    setStartLoading(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setErrorMessage("User not found in local storage.");
        setModalIsOpenError(true);
        return;
      }

      const data = JSON.parse(storedUser);
      const token = data?.token;
      const companyId = data?.appraiserCompanyDetail?.appraiserCompanyId;

      if (!token || !companyId) {
        setErrorMessage("Invalid user or company ID.");
        setModalIsOpenError(true);
        return;
      }

      try {
        const res = await axios.get("/api/getAllAppraiserByCompanyId", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            companyId: companyId,
          },
        });
        setDataFetched(true);
        setAppraiserCompanyInfo([]); // Optional: Only if needed
        setProperties(res.data?.data?.$values || []);
      } catch (err) {
        setDataFetched(false);
        setErrorMessage(
          err?.response?.data?.error ||
            "Something went wrong. Please try again."
        );
        setModalIsOpenError(true);
      }

      try {
        const res = await axios.get("/api/getAllAssignProperties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: companyId,
          },
        });

        const assignList = res.data?.data?.$values || [];
        setallListedAssignAppraiser(assignList);
      } catch (err) {
        setErrorMessage(
          err?.response?.data?.error || "Failed to fetch assigned properties."
        );
        setModalIsOpenError(true);
      }

      setRefresh(false);
    };

    fetchData();
  }, [refresh]);

  function sortAppraisersByStatus(appraisers) {
    const users = appraisers;
    let finalResult = [];
    let active = [],
      inactive = [],
      registered = [];
    users?.map((user, index) => {
      const status = user?.status?.props?.children.trim();
      if (String(status) === "Active") {
        active.push(user);
      }
      if (String(status) === "In-Active") {
        inactive.push(user);
      }
      if (String(status) === "Not Registered") {
        registered.push(user);
      }
    });

    finalResult.push(...active);
    finalResult.push(...inactive);
    finalResult.push(...registered);
    return finalResult;
  }

  return (
    <>
      {refresh ? (
        <Loader />
      ) : (
        <SmartTable
          title=""
          setSearchInput={setSearchInput}
          setFilterQuery={setFilterQuery}
          data={sortAppraisersByStatus(updatedData)}
          headCells={headCells}
          setRefresh={setRefresh}
          setProperties={setProperties}
          setCloseRegisterModal={setCloseRegisterModal}
          refresh={refresh}
          properties={updatedData}
          dataFetched={dataFetched}
          refreshHandler={refreshHandler}
          setStartLoading={setStartLoading}
          start={start}
          end={end}
        />
      )}
    </>
  );
}
