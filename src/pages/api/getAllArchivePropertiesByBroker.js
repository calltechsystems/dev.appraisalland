import axios from "axios";

export default async function handler(request, response) {
  const domain = process.env.BACKEND_DOMAIN;

  if (request.method !== "GET") {
    return response
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = request.headers.authorization;
    const { userId } = request.query;
    const intUserId = parseInt(userId);
    if (!token) {
      return request
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }
    const responseData = await axios.get(
      `${domain}/com.appraisalland.Property/GetBrokerArchivePropertyAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userId: intUserId,
        },
        validateStatus: () => true,
      }
    );
    return response.status(responseData.status).json(responseData.data);
  } catch (err) {
    console.error("Get Broker Archived Properties Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to fetch archived properties";

      return response.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }

    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
