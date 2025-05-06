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
    const decryptedBody = JSON.parse(
      decryptedBytes.toString(CryptoJS.enc.Utf8)
    );

    if (!decryptedBody?.quoteId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing QuoteId" });
    }

    const { quoteId, token } = decryptedBody;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.put(
      `${domain}/com.appraisalland.Broker/QuoteReActionByBrokerAsync`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          quoteId: quoteId,
        },
        validateStatus: () => true,
      }
    );

    return res.status(responseData.status).json(responseData.data);
  } catch (err) {
    console.error("Broker Re-Action Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.response.data?.message || "Unknown error"
            : "Broker quote re-action failed",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
