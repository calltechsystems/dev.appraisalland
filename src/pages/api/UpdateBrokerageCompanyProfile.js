import axios from "axios";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;

  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = req.body.data;

    if (!encryptedBody) {
      return res
        .status(400)
        .json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!body) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid encrypted payload" });
    }

    const {
      id,
      token,
      firstName,
      lastName,
      middleName,
      companyName,
      mortageBrokerLicNo,
      mortageBrokerageLicNo,
      city,
      province,
      postalCode,
      streetName,
      streetNumber,
      phoneNumber,
      cellNumber,
      brokerageName,
      apartmentNumber,
      assistantFirstName,
      assistantLastName,
      assistantPhoneNumber,
      assistantEmailAddress,
      assistantTwoFirstName,
      assistantTwoLastName,
      assistantTwoEmailAddress,
      assistantTwoPhoneNumber,
      emailId,
      profileImage,
      smsNotification,
      emailNotification,
    } = body;

    if (!id || !token) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fields: id or token",
        });
    }

    const payload = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      companyName: companyName,
      emailId: emailId,
      licenseNo: "",
      brokerageName: brokerageName,
      address: {
        streetName: streetName,
        streetNumber: streetNumber,
        city: city,
        province: province,
        apartmentNumber: apartmentNumber,
        postalCode: postalCode,
        area: "",
      },
      phoneNumber: phoneNumber,
      cellNumber: cellNumber,
      faxNumber: "",
      description: "",
      assistantEmailAddress: assistantEmailAddress,
      assistantFirstName: assistantFirstName,
      assistantLastName: assistantLastName,
      assistantPhoneNumber: assistantPhoneNumber,
      assistantTwoFirstName: assistantTwoFirstName,
      assistantTwoLastName: assistantTwoLastName,
      assistantTwoEmailAddress: assistantTwoEmailAddress,
      assistantTwoPhoneNumber: assistantTwoPhoneNumber,
      mortageBrokerageLicNo: mortageBrokerageLicNo,
      mortageBrokerLicNo: mortageBrokerLicNo,
      profileImage: profileImage,
      getSms: smsNotification ? 1 : 0,
      getEmail: emailNotification ? 1 : 0,
    };

    const responseData = await axios.put(
      `${domain}/com.appraisalland.Brokerage/UpdateBrokerageProfileAsync`,
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
    debugger;
    console.error("Update Brokerage Profile Error:", err);

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
