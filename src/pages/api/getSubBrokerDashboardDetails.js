import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const token = request.headers.authorization;
    const userId = request.query.userId;
    const noOfDays = request.query.noOfDays;

    const userResponse = await axios.get(
      `${domain}/Dashboard/getSubBrokerDashboardDetails`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userId,
          noOfDays,
        },
      }
    );

    return response.status(200).json({ msg: "OK", data: userResponse.data });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
