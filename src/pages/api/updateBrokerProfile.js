import axios from "axios";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = req.body?.data;

    if (!encryptedBody) {
      return res
        .status(400)
        .json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!body || !body.id || !body.token) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const {
      id,
      token,
      firstName,
      lastName,
      middleName,
      companyName,
      mortageBrokerLicNo,
      mortgageBrokerageLicNo,
      city,
      state,
      postalCode,
      streetName,
      streetNumber,
      phoneNumber,
      apartmentNumber,
      assistantFirstName,
      assistantLastName,
      assistantTwoFirstName,
      assistantTwoLastName,
      assistantPhoneNumber,
      assistantEmailAddress,
      assistantTwoEmailAddress,
      assistantTwoPhoneNumber,
      emailId,
      cellNumber,
      profileImage,
      smsNotification,
      emailNotification,
    } = body;

    const payload = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      companyName: companyName,
      emailId: emailId,
      assistantTwoPhoneNumber: assistantTwoPhoneNumber,
      assistantTwoEmailAddress: assistantTwoEmailAddress,
      licenseNo: "",
      brokerageName: "",
      address: {
        streetName: streetName,
        streetNumber: streetNumber,
        city: city,
        province: state,
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
      mortageBrokerageLicNo: mortgageBrokerageLicNo,
      mortageBrokerLicNo: mortageBrokerLicNo,
      profileImage: profileImage,
      getSms: smsNotification ? 1 : 0,
      getEmail: emailNotification ? 1 : 0,
    };
    const responseData = await axios.put(
      `${domain}/com.appraisalland.Broker/UpdateBrokerProfileAsync`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: { userId: id },
        validateStatus: () => true,
      }
    );
    res.status(responseData.status).json(responseData.data);
  } catch (err) {
    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Update failed"
          : "Unable to update broker profile";

      return res
        .status(statusCode)
        .json({ success: false, message: errorMessage });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
