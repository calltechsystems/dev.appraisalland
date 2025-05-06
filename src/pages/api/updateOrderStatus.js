import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  if (request.method !== "PUT") {
    return response
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = request.body?.data;
    debugger;
    if (!encryptedBody) {
      return response
        .status(400)
        .json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    const {
      token,
      quoteId,
      remark,
      statusDate,
      orderStatus,
      user_id,
      user_type,
    } = body;

    if (!quoteId || !orderStatus || !statusDate || !user_id || !user_type) {
      return response
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const payload = {
      quoteId: quoteId,
      orderStatus: orderStatus,
      remark: remark,
      statusDate: statusDate,
      user_id,
      user_type,
    };

    const responseData = await axios.put(
      `${domain}/com.appraisalland.Bid/UpdateApprasialStatusAsync`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );
    response.status(responseData.status).json(responseData.data);
    
  } catch (err) {
    console.error("Error updating appraisal status:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const message =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Appraisal status update failed"
          : "Unable to update appraisal status";

      return response.status(statusCode).json({ success: false, message });
    }

    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export default handler;
