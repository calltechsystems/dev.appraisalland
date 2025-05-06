import axios from "axios";

async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;

    if (!token) {
      console.error("Get All Properties Token not found:", token);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.get(
      `${domain}/com.appraisalland.Property/GetAllPropertyAsync`,
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
    console.error("Get All Properties Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.response.data?.message || "Unknown error"
            : "Failed to fetch properties",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export default handler;
