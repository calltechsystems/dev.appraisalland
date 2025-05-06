import axios from "axios";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing topUpId in query" });
    }

    const responseData = await axios.get(
      `${domain}/com.appraisalland.Plan/GetTopUpPlanAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          topUpId: id,
        },
        validateStatus: () => true,
      }
    );

    return res.status(responseData.status).json(responseData.data);
  } catch (err) {
    console.error("Get Top-Up Plan Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to fetch top-up plan";

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
