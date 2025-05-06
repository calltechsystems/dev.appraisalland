import axios from "axios";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const body = req.body;

    if (!body) {
      return res.status(400).json({ success: false, message: "Missing request body" });
    }

    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId" });
    }

    const {
      userId,
      streetName,
      streetNumber,
      city,
      state,
      postalCode,
      area,
      propertyId,
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
      applicantAddress,
      attachment,
      remark,
      quoteRequiredDate,
      image,
      token
    } = body;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const formData = {
      userId: userId,
      propertyId: propertyId,
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
      remark: remark,
      quoteRequiredDate: quoteRequiredDate,
    };

    const responseData = await axios.put(
      `${domain}/com.appraisalland.Property/UpdatePropertyAsync`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
        params: { orderId },
      }
    );

    return res.status(responseData.status).json(responseData.data);

  } catch (err) {

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to update property";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
