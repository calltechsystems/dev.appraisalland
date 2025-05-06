import axios from "axios";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const body = req.body;
    if (!body) {
      return res.status(400).json({ success: false, message: "Missing request body" });
    }

    const {
      userId,
      propertyId,
      streetName,
      streetNumber,
      city,
      state,
      postalCode,
      area,
      community,
      typeOfBuilding,
      applicantFirstName,
      applicantLastName,
      applicantEmailAddress,
      applicantPhoneNumber,
      bidLowerRange,
      bidUpperRange,
      urgency,
      propertyStatus,
      estimatedValue,
      typeOfAppraisal,
      lenderInformation,
      purpose,
      remark,
      quoteRequiredDate,
      applicantAddress,
      attachment,
      image,
      token,
    } = body;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const formData = {
      userId: userId,
      streetName: streetName,
      streetNumber: streetNumber,
      city: city,
      province: state,
      postalCode: postalCode,
      area: area,
      community: community,
      typeOfBuilding: typeOfBuilding,
      applicantFirstName: applicantFirstName,
      applicantLastName: applicantLastName,
      applicantEmailAddress: applicantEmailAddress,
      applicantPhoneNumber: applicantPhoneNumber,
      bidLowerRange: bidLowerRange,
      bidUpperRange: bidUpperRange,
      propertyStatus: propertyStatus,
      urgency: urgency,
      estimatedValue: estimatedValue,
      purpose: purpose,
      typeOfAppraisal: typeOfAppraisal,
      lenderInformation: lenderInformation,
      applicantAddress: applicantAddress,
      attachment: attachment,
      image: image,
      remark : remark,
      quoteRequiredDate:quoteRequiredDate
    };

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Property/AddPropertyAsync`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );
    return res.status(responseData.status).json(responseData.data);

  } catch (err) {
    console.error("Add Property Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to submit property";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    } else {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}
