import axios from "axios";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;

  if (req.method !== "POST") {
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
    const { subscriptionId, userId, token } = decryptedBody;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!subscriptionId || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing subscriptionId or userId" });
    }

    const responseData = await axios.post(
      `${domain}/RecurringPayments/subscribe`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: userId,
          subscriptionId: subscriptionId,
        },
        validateStatus: () => true,
      }
    );

    res.status(responseData.status).json(responseData.data);
  } catch (err) {
    console.error("Recurring Subscription Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Subscription failed";

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
