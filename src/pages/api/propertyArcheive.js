import axios from "axios";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { status, userId, orderId } = req.query;

    if (!orderId || typeof status === "undefined") {
      return res
        .status(400)
        .json({ success: false, message: "Missing required query parameters" });
    }

    const payload = {
      userId: Number(userId),
      status: String(status) === "true" ? true : false,
      orderId: Number(orderId),
    };

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Property/ArchivePropertyByBrokerAsync`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );

    return res.status(responseData.status).json(responseData.data);
  } catch (err) {
    console.error("Archive Property Error:", err);
    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to archive property";

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
