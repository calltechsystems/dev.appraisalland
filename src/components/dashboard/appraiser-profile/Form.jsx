import { handleDownloadClick } from "./downloadFunction";

const Form = ({ userData, chnageShowCardHandler }) => {
  const userData_01 = userData.userType; // Example data, replace with actual data

  const renderUserType = (userData_01) => {
    if (userData_01 === 3) {
      return "Appraiser";
    } else if (userData_01 === 5) {
      return "Appraiser";
    } else {
      return "Unknown User Type"; // Default value if userType is not 1 or 6
    }
  };

  const formatPhoneNumber = (number) => {
    if (!number) return ""; // Handle empty input

    // Remove non-numeric characters
    const digits = number.replace(/\D/g, "");

    // Format the number as "416 123-4567"
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

  return (
    <form className="contact_form" action="#" style={{ borderRadius: "5px" }}>
      <div className="row">
        <div className="col-lg-3 text-center">
          <div className="wrap-custom-file mt-5 mb-5">
            <img
              style={{ borderRadius: "50%" }}
              src={userData?.appraiserDetail?.profileImage}
              alt="Uploaded Image"
            />
          </div>
          {/* End .col */}
        </div>
        <div className="col-lg-9">
          <div className="row mb-2">
            <div className="col-lg-9">
              <div className="">
                <span style={{ fontWeight: "bold" }}>
                  <h3 className="text-center text-color">
                    {" "}
                    Appraiser Details{" "}
                  </h3>
                </span>
                {/* <hr /> */}
                <div
                  className="d-flex justify-content-center"
                  id="property-info-container"
                >
                  <table id="table-broker-info">
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="table-header">
                          <span className="text-start">User ID</span>
                        </td>
                        <td className="table-value"> {userData.userEmail}</td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start"> User Type</span>
                        </td>
                        <td className="table-value">
                          {renderUserType(userData_01)}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start">Name</span>
                        </td>
                        <td className="table-value">
                          {" "}
                          {userData?.appraiserDetail?.firstName}{" "}
                          {userData?.appraiserDetail?.middleName}{" "}
                          {userData?.appraiserDetail?.lastName}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start"> Company Name </span>
                        </td>
                        <td className="table-value">
                          {userData?.appraiserDetail?.companyName
                            ? userData?.appraiserDetail?.companyName
                            : "N.A."}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start"> Email Address</span>
                        </td>
                        <td className="table-value">
                          {userData?.appraiserDetail?.emailId}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start"> Phone Number</span>
                        </td>
                        <td className="table-value">
                          {formatPhoneNumber(
                            userData?.appraiserDetail?.phoneNumber
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start"> Cell Number</span>
                        </td>
                        <td className="table-value">
                          <span className="text-start text-dark fw-bold">
                            {userData?.appraiserDetail?.cellNumber
                              ? formatPhoneNumber(
                                  userData?.appraiserDetail?.cellNumber
                                )
                              : "N.A."}
                            {/* {userData?.appraiserDetail?.cellNumber
                              ? userData?.appraiserDetail?.cellNumber
                              : "N.A."} */}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start">Address</span>
                        </td>
                        <td className="table-value">
                          {" "}
                          {
                            userData?.appraiserDetail?.address?.streetNumber
                          }{" "}
                          {userData?.appraiserDetail?.address?.streetName}{" "}
                          {userData?.appraiserDetail?.address?.apartmentNumber}{" "}
                          {userData?.appraiserDetail?.address?.city},{" "}
                          {userData?.appraiserDetail?.address?.province},{" "}
                          {userData?.appraiserDetail?.address?.postalCode}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start">Designation</span>
                        </td>
                        <td className="table-value">
                          <span className="text-start text-dark fw-bold">
                            {userData?.appraiserDetail?.designation}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-header">
                          <span className="text-start">Lender List</span>
                        </td>
                        <td className="table-value">
                          {" "}
                          {
                            <span className="text-start text-dark fw-bold">
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={
                                  userData?.appraiserDetail?.lenderListUrl !==
                                  ""
                                    ? userData?.appraiserDetail?.lenderListUrl
                                    : ""
                                }
                                onClick={(event) =>
                                  handleDownloadClick(
                                    event,
                                    userData?.appraiserDetail?.lenderListUrl,
                                    `${userData?.appraiserDetail?.firstName}_lenderlist.pdf`
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                              >
                                Lender List Pdf
                              </a>
                            </span>
                          }{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-center mt-2">
                  <button
                    className="btn btn2 btn-color profile_edit_button_01"
                    onClick={() => chnageShowCardHandler(false)}
                  >
                    <span
                      // className="flaticon-edit"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Edit Profile"
                    >
                      {" "}
                      Edit Profile
                    </span>
                  </button>
                </div>
              </div>
            </div>
            {/* End .col */}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
