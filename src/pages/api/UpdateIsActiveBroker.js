import axios from "axios";
import CryptoJS from "crypto-js";

export default async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  if (request.method !== "PUT") {
    return response
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = request.body?.data;

    if (!encryptedBody) {
      return response
        .status(400)
        .json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    if (
      !body ||
      !body.brokerId ||
      !body.brokerageId ||
      body.isActive === undefined
    ) {
      return response
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const { brokerId, brokerageId, isActive } = body;
    const token = request.headers.authorization;

    const responseData = await axios.put(
      `${domain}/com.appraisalland.Broker/updateBrokerIsActiveAsync`,
      {
        brokerId: brokerId,
        brokerageId: brokerageId,
        value: isActive,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );

    response.status(responseData.status).json(responseData.data);
  } catch (err) {
    if (err.response) {
      const statusCode = err.response.status;
      const message =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Failed to update broker status"
          : "Unable to update broker status";

      return response.status(statusCode).json({ success: false, message });
    }

    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
