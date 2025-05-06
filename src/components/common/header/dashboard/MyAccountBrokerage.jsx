import Link from "next/link";
import Router, { useRouter } from "next/router";
import { isSinglePageActive } from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import { use, useEffect } from "react";
import { useState } from "react";

const MyAccount = ({ userData }) => {
  const logout = () => {
    localStorage.removeItem("user");
    route.push("/login");
  };
  const profileMenuItems = [
    { id: 1, name: "Profile", ruterPath: "/brokerage-profile" },

    {
      id: 2,
      name: "Change Password ",
      ruterPath: "/brokerage-company-change-password",
    },
    { id: 5, name: "Log out", ruterPath: "/login", onClick: { logout } },
  ];

  const [profileValue, setProfileValue] = useState(0);
  useEffect(() => {
    let count = 0;
    if (userData?.userType === 1) {
      if (userData.brokerDetail.firstName) {
        count = count + 1;
      }
      if (userData.brokerDetail.middleName) {
        count = count + 1;
      }
      if (userData.brokerDetail.lastName) {
        count = count + 1;
      }
      if (userData.brokerDetail.licenseNo != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.address?.addressLineOne != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.address?.addressLineTwo != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.address?.area != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.assistantFirstName != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.assistantPhoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.brokerageName != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.address?.city != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.companyName != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.mortageBrokerLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.mortageBrokerageLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.phoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.profileImage != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.address?.province != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.address?.postalCode != null) {
        count = count + 1;
      }

      const change = (count / 18) * 100;
      setProfileValue(change);
    } else if (userData?.userType === 2) {
      if (userData.brokerageDetail.firstName) {
        count = count + 1;
      }
      if (userData.brokerageDetail.middleName) {
        count = count + 1;
      }
      if (userData.brokerageDetail.lastName) {
        count = count + 1;
      }
      if (userData.brokerageDetail.licenseNo != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.address?.addressLineOne != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.address?.addressLineTwo != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.address?.area != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.assistantFirstName != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.assistantPhoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.brokerageName != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.address?.city != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.companyName != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.mortageBrokerLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.mortageBrokerageLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.phoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.profileImage != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.address?.province != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.address?.postalCode != null) {
        count = count + 1;
      }

      const change = (count / 18) * 100;
      setProfileValue(change);
    }
  }, []);
  const route = useRouter();

  return (
    <>
      <div className="user_set_header">
        <Image
          width={40}
          height={40}
          className="float-center mb-1"
          src={
            userData?.brokerageDetail?.profileImage
              ? userData.brokerageDetail?.profileImage
              : `/assets/images/home/placeholder_01.jpg`
          }
          alt="e1.png"
        />
        <p>
          {userData?.brokerageDetail?.firstName
            ? `${userData.brokerageDetail?.firstName} ${userData?.brokerageDetail?.lastName}`
            : "Name"}
          <br />
          <span className="address">
            {userData?.userEmail ? userData.userEmail : "xyz@gmail.com"}
          </span>
        </p>
      </div>
      {/* End user_set_header */}

      <div className="user_setting_content">
        {profileMenuItems.map((item) => (
          <Link
            href={item.ruterPath}
            key={item.id}
            className="dropdown-item link-hover"
            style={
              isSinglePageActive(`${item.ruterPath}`, route.pathname)
                ? { color: "#ff5a5f" }
                : undefined
            }
          >
            {item.id === 5 ? (
              <span style={{ color: "#2e008b" }} onClick={logout}>
                Logout
              </span>
            ) : (
              <div className="row">
                <div className="col-lg-6">{item.name}</div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  );
};

export default MyAccount;
