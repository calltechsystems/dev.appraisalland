import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const token = request.headers.authorization;
    const userId = request.query.userId;
    const noOfDays = request.query.noOfDays;

    const responseData = await axios.get(
      `${domain}/Dashboard/getAppraisalCompanyDashboardDetails`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userId,
          noOfDays,
        },
        validateStatus: () => true,
      }
    );

    return response.status(responseData.status).json(responseData.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
