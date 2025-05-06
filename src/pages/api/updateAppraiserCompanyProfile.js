import axios from "axios";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    if (!body) {
      return res
        .status(400)
        .json({ success: false, message: "Missing request body" });
    }

    const {
      id,
      token,
      firstName,
      addressLineOne,
      lastName,
      cellNumber,
      lenderListUrl,
      addressLineTwo,
      city,
      licenseNumber,
      state,
      postalCode,
      phoneNumber,
      officeContactEmail,
      officeContactLastName,
      officeContactFirstName,
      officeContactPhone,
      appraiserCompanyName,
      emailId,
      apartmentNumber,
      streetName,
      streetNumber,
      profileImage,
      smsNotification,
      emailNotification,
    } = body;

    if (!id || !token) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: id or token",
      });
    }

    const payload = {
      firstName: firstName,
      licenseNumber: licenseNumber,
      lastName: lastName,
      AppraiserCompanyName: appraiserCompanyName,
      address: {
        addressLineOne: addressLineOne,
        addressLineTwo: addressLineTwo,
        apartmentNumber: apartmentNumber,
        streetName: streetName,
        streetNumber: streetNumber,
        city: city,
        state: state,
        postalCode: postalCode,
      },
      cellNumber: cellNumber,
      officeContactFirstName: officeContactFirstName,
      officeContactLastName: officeContactLastName,
      phoneNumber: phoneNumber,
      officeContactEmail: officeContactEmail,
      lenderListUrl: lenderListUrl,
      officeContactPhone: officeContactPhone,
      emailId: emailId,
      profileImage: profileImage,
      getSms: smsNotification ? 1 : 0,
      getEmail: emailNotification ? 1 : 0,
    };

    const responseData = await axios.put(
      `${domain}/com.appraisalland.AppraiserCompany/UpdateAppraiserCompanyProfileAsync`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: id,
        },
        validateStatus: () => true,
      }
    );

    return res.status(responseData.status).json(responseData.data);
  } catch (err) {
    console.error("Update Appraiser Company Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Update failed"
          : "Unable to update profile";

      return res.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
