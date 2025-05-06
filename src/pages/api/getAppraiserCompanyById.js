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
    const { userId } = req.query;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.get(`${domain}/AppraiserCompany`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      params: {
        companyId: userId,
      },
      validateStatus: () => true,
    });

    return res.status(responseData.status).json(responseData.data);
  } catch (err) {
    console.error("Get Appraiser Company Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.response.data?.message || "Unknown error"
            : "Failed to fetch appraiser company details",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
