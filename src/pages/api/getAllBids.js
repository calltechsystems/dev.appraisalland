import axios from "axios";

export default async function handler(Request, response) {
  const domain = process.env.BACKEND_DOMAIN;

  if (Request.method !== "GET") {
    return response
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = Request.headers.authorization;

    if (!token) {
      return response
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const coreApiResponse = await axios.get(
      `${domain}/com.appraisalland.Bid/GetAllQuotesByAppraiserAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );
    return response.status(coreApiResponse.status).json(coreApiResponse.data);
  } catch (err) {
    console.error("Get Appraiser Quotes Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to fetch quotes";

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
